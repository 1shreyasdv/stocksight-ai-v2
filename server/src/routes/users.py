from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.database import get_db
from src import models, schemas
from src.auth import get_current_user, hash_password

router = APIRouter()


@router.get("/me", response_model=schemas.UserOut)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.put("/me")
def update_profile(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if "name" in payload:
        current_user.name = payload["name"]
    if "password" in payload and payload["password"]:
        current_user.hashed_password = hash_password(payload["password"])
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated"}


@router.get("/portfolio")
def get_portfolio(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    orders = db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).all()
    holdings = {}
    for order in orders:
        sym = order.symbol
        ot = order.order_type.value.lower() if hasattr(order.order_type, 'value') else str(order.order_type).lower()
        if sym not in holdings:
            holdings[sym] = {"symbol": sym, "quantity": 0.0, "total_cost": 0.0, "trades": 0}
        if ot == "buy":
            holdings[sym]["quantity"] += float(order.quantity)
            holdings[sym]["total_cost"] += float(order.quantity) * float(order.price)
        else:
            holdings[sym]["quantity"] -= float(order.quantity)
        holdings[sym]["trades"] += 1
    result = []
    for sym, h in holdings.items():
        if h["quantity"] > 0:
            avg_price = h["total_cost"] / h["quantity"] if h["quantity"] > 0 else 0
            result.append({
                "symbol": sym,
                "quantity": round(h["quantity"], 6),
                "avg_price": round(avg_price, 2),
                "current_price": avg_price,
                "current_value": round(h["quantity"] * avg_price, 2),
                "pnl": 0,
                "trades": h["trades"]
            })
    return result


@router.get("/watchlist")
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items = db.query(models.WatchlistItem).filter(
        models.WatchlistItem.user_id == current_user.id
    ).all()
    return [{"symbol": w.symbol, "added_at": w.added_at} for w in items]


@router.post("/watchlist/{symbol}")
def add_to_watchlist(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    exists = db.query(models.WatchlistItem).filter(
        models.WatchlistItem.user_id == current_user.id,
        models.WatchlistItem.symbol == symbol.upper()
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="Symbol already in watchlist")

    item = models.WatchlistItem(user_id=current_user.id, symbol=symbol.upper())
    db.add(item)
    db.commit()
    return {"message": f"{symbol.upper()} added to watchlist"}


@router.delete("/watchlist/{symbol}")
def remove_from_watchlist(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.WatchlistItem).filter(
        models.WatchlistItem.user_id == current_user.id,
        models.WatchlistItem.symbol == symbol.upper()
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Symbol not in watchlist")
    db.delete(item)
    db.commit()
    return {"message": f"{symbol.upper()} removed from watchlist"}
