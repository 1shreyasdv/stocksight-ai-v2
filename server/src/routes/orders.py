from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.database import get_db
from src import models, schemas
from src.auth import get_current_user
from src.utils.stocks_registry import SYMBOL_MAP

router = APIRouter()


@router.post("/")
def place_order(
    payload: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    sym = payload.symbol.upper()
    meta = SYMBOL_MAP.get(sym) or {"name": sym, "logo_color": "#7c6ff720", "logo_letter": sym[0]}

    order_type_upper = payload.order_type.upper()
    trade_type_str = getattr(payload, 'trade_type', 'MARKET').upper()
    total = round(payload.quantity * payload.price, 6)
    fee = round(total * 0.001, 6)

    name_val = getattr(payload, 'name', None) or meta.get('name', sym)

    order = models.Order(
        user_id=current_user.id,
        symbol=sym,
        name=name_val,
        order_type=models.OrderType[order_type_upper],
        trade_type=models.TradeType[trade_type_str],
        quantity=payload.quantity,
        price=payload.price,
        total=total,
        fee=fee,
        status=models.OrderStatus.COMPLETED,
    )
    db.add(order)

    # Update portfolio holding
    holding = db.query(models.Portfolio).filter(
        models.Portfolio.user_id == current_user.id,
        models.Portfolio.symbol == sym
    ).first()

    if order_type_upper == "BUY":
        if holding:
            new_qty = holding.quantity + payload.quantity
            holding.avg_price = round(
                (holding.avg_price * holding.quantity + payload.price * payload.quantity) / new_qty, 6
            )
            holding.quantity = new_qty
        else:
            new_holding = models.Portfolio(
                user_id=current_user.id,
                symbol=sym,
                name=name_val,
                quantity=payload.quantity,
                avg_price=payload.price,
                logo_color=meta.get('logo_color', '#7c6ff720'),
                logo_letter=meta.get('logo_letter', sym[0]),
            )
            db.add(new_holding)
    elif order_type_upper == "SELL":
        if holding:
            if holding.quantity < payload.quantity:
                raise HTTPException(status_code=400, detail="Insufficient holdings to sell")
            holding.quantity = round(holding.quantity - payload.quantity, 6)
            if holding.quantity <= 0:
                db.delete(holding)

    db.commit()
    db.refresh(order)
    return {
        "id": order.id,
        "symbol": order.symbol,
        "order_type": order.order_type.value.lower(),
        "quantity": float(order.quantity),
        "price": float(order.price),
        "status": order.status.value.lower(),
        "created_at": str(order.created_at),
        "user_id": order.user_id
    }


@router.get("/")
def list_orders(
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    symbol: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Order).filter(models.Order.user_id == current_user.id)
    if symbol:
        query = query.filter(models.Order.symbol == symbol.upper())
    orders = query.order_by(models.Order.created_at.desc()).offset(offset).limit(limit).all()
    return [
        {
            "id": o.id,
            "symbol": o.symbol,
            "order_type": o.order_type.value.lower() if hasattr(o.order_type, 'value') else str(o.order_type).lower(),
            "quantity": float(o.quantity),
            "price": float(o.price),
            "status": o.status.value.lower() if hasattr(o.status, 'value') else str(o.status).lower(),
            "created_at": str(o.created_at),
            "user_id": o.user_id
        }
        for o in orders
    ]


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{order_id}")
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == models.OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot cancel a completed order")

    order.status = models.OrderStatus.CANCELLED
    db.commit()
    return {"message": "Order cancelled"}
