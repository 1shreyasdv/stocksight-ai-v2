from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Optional
from datetime import datetime, timedelta

from src.database import get_db
from src import models, schemas
from src.auth import require_admin

router = APIRouter()


# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    total_users    = db.query(models.User).count()
    total_orders   = db.query(models.Order).count()
    active_traders = db.query(models.Order.user_id).distinct().count()
    total_revenue  = (
        db.query(func.sum(models.Order.price * models.Order.quantity)).scalar() or 0
    )
    return {
        "total_users":    total_users,
        "total_orders":   total_orders,
        "active_traders": active_traders,
        "total_revenue":  float(total_revenue),
    }


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[schemas.UserAdminOut])
def list_all_users(
    limit:  int = Query(50, le=200),
    offset: int = Query(0),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    query = db.query(models.User)
    if search:
        query = query.filter(
            models.User.name.ilike(f"%{search}%")
            | models.User.email.ilike(f"%{search}%")
        )
    return (
        query.order_by(models.User.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = payload.get("is_active", True)
    db.commit()
    return {"message": "Updated", "is_active": user.is_active}


@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    payload: schemas.UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = payload.role
    db.commit()
    return {"message": f"User role updated to {payload.role}"}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# ── Orders ────────────────────────────────────────────────────────────────────

def _safe_val(val) -> str:
    """Convert enum or string to plain string value."""
    return val.value if hasattr(val, "value") else str(val)


@router.get("/orders")
def list_all_orders(
    limit:  int = Query(50, le=200),
    offset: int = Query(0),
    symbol: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    query = db.query(models.Order).join(
        models.User, models.Order.user_id == models.User.id
    )
    if symbol:
        query = query.filter(models.Order.symbol == symbol.upper())

    orders = (
        query.order_by(models.Order.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    result = []
    for o in orders:
        result.append(
            {
                "id":         o.id,
                "symbol":     o.symbol,
                "order_type": _safe_val(o.order_type),
                "quantity":   float(o.quantity),
                "price":      float(o.price),
                "status":     _safe_val(o.status),
                "created_at": str(o.created_at),
                "user_id":    o.user_id,
                "user": {
                    "id":    o.user.id,
                    "name":  o.user.name,
                    "email": o.user.email,
                    "role":  _safe_val(o.user.role),
                },
            }
        )
    return result


# ── Charts ────────────────────────────────────────────────────────────────────

@router.get("/chart/user-growth")
def user_growth_chart(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Real monthly user-signup counts for the last 12 months."""
    now    = datetime.utcnow()
    months = []
    for i in range(11, -1, -1):
        # Step back month-by-month without day overflow
        target = (now.replace(day=1) - timedelta(days=i * 30)).replace(day=1)
        count  = (
            db.query(models.User)
            .filter(
                extract("month", models.User.created_at) == target.month,
                extract("year",  models.User.created_at) == target.year,
            )
            .count()
        )
        months.append({"label": target.strftime("%b").upper(), "value": count})
    return months


@router.get("/chart/trading-volume")
def trading_volume_chart(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Real buy/sell order counts for the last 7 days."""
    now    = datetime.utcnow()
    result = []

    for i in range(6, -1, -1):
        day       = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end   = day_start + timedelta(days=1)

        orders = (
            db.query(models.Order)
            .filter(
                models.Order.created_at >= day_start,
                models.Order.created_at <  day_end,
            )
            .all()
        )

        buy_count  = sum(
            1 for o in orders
            if _safe_val(o.order_type).lower() in ("buy", "ordertype.buy")
        )
        sell_count = sum(
            1 for o in orders
            if _safe_val(o.order_type).lower() in ("sell", "ordertype.sell")
        )

        result.append(
            {
                "label": day.strftime("%a").upper()[:3],  # MON, TUE …
                "buy":   buy_count,
                "sell":  sell_count,
            }
        )
    return result
