from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import random

from src.database import get_db
from src import models, schemas
from src.auth import require_admin

router = APIRouter()


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    total_users = db.query(models.User).count()
    total_orders = db.query(models.Order).count()
    active_traders = db.query(models.Order.user_id).distinct().count()
    total_revenue = db.query(
        func.sum(models.Order.price * models.Order.quantity)
    ).scalar() or 0
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "active_traders": active_traders,
        "total_revenue": float(total_revenue)
    }


@router.get("/users", response_model=List[schemas.UserAdminOut])
def list_all_users(
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    query = db.query(models.User)
    if search:
        query = query.filter(
            (models.User.name.ilike(f"%{search}%")) |
            (models.User.email.ilike(f"%{search}%"))
        )
    return query.order_by(models.User.created_at.desc()).offset(offset).limit(limit).all()


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


@router.get("/orders")
def list_all_orders(
    limit: int = Query(50, le=200),
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
    orders = query.order_by(models.Order.created_at.desc()).offset(offset).limit(limit).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "symbol": order.symbol,
            "order_type": order.order_type.value if hasattr(order.order_type, 'value') else str(order.order_type),
            "quantity": float(order.quantity),
            "price": float(order.price),
            "status": order.status.value if hasattr(order.status, 'value') else str(order.status),
            "created_at": str(order.created_at),
            "user_id": order.user_id,
            "user": {
                "id": order.user.id,
                "name": order.user.name,
                "email": order.user.email,
                "role": order.user.role.value if hasattr(order.user.role, 'value') else str(order.user.role)
            }
        })
    return result


from sqlalchemy import func, extract
from datetime import datetime, timedelta

@router.get("/chart/user-growth")
def user_growth_chart(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Real monthly user signup counts for the last 12 months."""
    now = datetime.utcnow()
    months = []
    for i in range(11, -1, -1):
        month_date = now.replace(day=1) - timedelta(days=i * 30)
        month_num = month_date.month
        year_num = month_date.year
        count = db.query(models.User).filter(
            extract('month', models.User.created_at) == month_num,
            extract('year', models.User.created_at) == year_num,
        ).count()
        months.append({
            "label": month_date.strftime("%b").upper(),
            "value": count
        })
    return months

@router.get("/chart/trading-volume")
def trading_volume_chart(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    result = []
    for i in range(6, -1, -1):
        day_date = now - timedelta(days=i)
        day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        # Count ALL orders that day
        all_orders = db.query(models.Order).filter(
            models.Order.created_at >= day_start,
            models.Order.created_at < day_end,
        ).all()
        
        buy_count = sum(1 for o in all_orders if str(o.order_type).lower() in ('buy', 'ordertype.buy'))
        sell_count = sum(1 for o in all_orders if str(o.order_type).lower() in ('sell', 'ordertype.sell'))
        
        result.append({
            "label": days[day_date.weekday()],
            "buy": buy_count,
            "sell": sell_count
        })
    return result
