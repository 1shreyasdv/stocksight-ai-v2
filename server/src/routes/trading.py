from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from src.database import get_db
from src.auth import get_current_user
from src.models import User, Wallet, Transaction, OrderType
from src.routes.market import get_prices

router = APIRouter()

class TradeRequest(BaseModel):
    asset: str
    quantity: float
    price: float
    type: str  # BUY or SELL

@router.post("/trade")
def trade(data: TradeRequest,
          db: Session = Depends(get_db),
          user: User = Depends(get_current_user)):
    
    if data.quantity <= 0 or data.price <= 0:
        raise HTTPException(status_code=422, detail="Invalid trade parameters")

    total = data.quantity * data.price

    wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    if not wallet:
        raise HTTPException(status_code=400, detail="Wallet not initialized")

    if data.type.upper() == "BUY":
        if wallet.balance < total:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        wallet.balance -= total

    elif data.type.upper() == "SELL":
        # Validate holdings
        transactions = db.query(
            func.sum(
                func.case(
                    (Transaction.type == OrderType.BUY, Transaction.quantity),
                    else_=-Transaction.quantity
                )
            ).label("net_quantity")
        ).filter(
            Transaction.user_id == user.id,
            Transaction.asset == data.asset
        ).first()

        owned_quantity = getattr(transactions, "net_quantity", 0) or 0
        if owned_quantity < data.quantity:
            raise HTTPException(status_code=400, detail="Insufficient holdings to sell")
        
        wallet.balance += total
    else:
        raise HTTPException(status_code=422, detail="Invalid trade type")

    # Record transaction utilizing SQLAlchemy mappings
    new_txn = Transaction(
        user_id=user.id,
        asset=data.asset,
        type=OrderType.BUY if data.type.upper() == "BUY" else OrderType.SELL,
        quantity=data.quantity,
        price=data.price
    )
    db.add(new_txn)
    db.commit()

    return {"message": "Trade successful", "balance": wallet.balance}


@router.get("/portfolio")
def get_portfolio(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    transactions_check = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    if not transactions_check:
        return []

    # Aggregate net quantity holding per asset
    result = db.query(
        Transaction.asset,
        func.sum(
            func.case(
                (Transaction.type == OrderType.BUY, Transaction.quantity),
                else_=-Transaction.quantity
            )
        ).label("quantity"),
        func.avg(Transaction.price).label("avg_price")
    ).filter(
        Transaction.user_id == current_user.id
    ).group_by(
        Transaction.asset
    ).all()

    # Get live market prices manually (ideally utilizing a singleton cache wrapper in production)
    live_prices = get_prices()

    holdings = []
    total_portfolio_value = 0.0

    for r in result:
        qty = float(r.quantity)
        if qty > 0:
            avg_p = float(r.avg_price)
            sym = r.asset.upper()
            
            # Match live price proxy or fallback to avg
            current_p = live_prices.get(sym, {}).get("price", avg_p)
            current_value = qty * current_p
            pnl = (current_p - avg_p) * qty
            pnl_percent = ((current_p - avg_p) / avg_p) * 100 if avg_p > 0 else 0

            holdings.append({
                "asset": sym,
                "symbol": sym, # Used identically for ui mapping fallback compatibility
                "quantity": qty,
                "avg_price": avg_p,
                "current_price": current_p,
                "current_value": current_value,
                "total_value": current_value,
                "pnl": pnl,
                "pnl_percent": pnl_percent
            })
            total_portfolio_value += current_value

    return holdings


@router.get("/wallet")
def get_wallet(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance=100000)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return wallet
