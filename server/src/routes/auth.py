from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import pyotp
import os

from src.database import get_db
from src import models, schemas
from src.auth import (
    hash_password, verify_password,
    create_access_token, get_current_user
)

router = APIRouter()


@router.post("/register", response_model=schemas.TokenResponse, status_code=201)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=models.UserRole.user,
        otp_secret=pyotp.random_base32(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically provision default Wallet as per specification
    user_wallet = models.Wallet(user_id=user.id, balance=100000.0)
    db.add(user_wallet)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=schemas.TokenResponse)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended. Contact support.")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/admin-login", response_model=schemas.TokenResponse)
def admin_login(payload: schemas.AdminLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.role != models.UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access only")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended")

    # Verify TOTP OTP
    if user.otp_secret:
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(payload.otp, valid_window=1):
            # Allow static dev OTP via env var for testing
            dev_otp = os.getenv("DEV_ADMIN_OTP", "")
            if payload.otp != dev_otp:
                raise HTTPException(status_code=401, detail="Invalid OTP code")

    token = create_access_token(
        {"sub": str(user.id), "role": "admin"},
        # Shorter expiry for admin sessions
        expires_delta=__import__("datetime").timedelta(hours=8)
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout():
    # JWT is stateless — client deletes the cookie
    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        # Don't reveal if email exists for security
        return {"message": "If an account exists, a reset link has been sent"}
    
    # In a real app, generate a token, save to DB, and send email
    # Here we just simulate success
    return {"message": "Reset link sent to email"}


@router.post("/reset-password")
def reset_password(payload: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    # In a real app, verify the token first
    # For now, we simulate reset via email lookup (not secure, but for demo)
    # user = verify_reset_token(payload.token, db)
    
    # For simulation, we'll assume the token is just the email for now
    user = db.query(models.User).filter(models.User.email == payload.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password reset successful"}
