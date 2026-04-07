from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.database import get_db
from src import models, schemas
from src.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.PriceAlertOut, status_code=201)
def create_alert(
    payload: schemas.PriceAlertCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    alert = models.PriceAlert(
        user_id=current_user.id,
        symbol=payload.symbol.upper(),
        target_price=payload.target_price,
        condition=payload.condition.upper(),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.get("/", response_model=List[schemas.PriceAlertOut])
def list_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.PriceAlert).filter(models.PriceAlert.user_id == current_user.id).all()

@router.delete("/{alert_id}")
def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    alert = db.query(models.PriceAlert).filter(
        models.PriceAlert.id == alert_id,
        models.PriceAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted"}

@router.put("/{alert_id}/toggle")
def toggle_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    alert = db.query(models.PriceAlert).filter(
        models.PriceAlert.id == alert_id,
        models.PriceAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_active = not alert.is_active
    db.commit()
    db.refresh(alert)
    return alert
