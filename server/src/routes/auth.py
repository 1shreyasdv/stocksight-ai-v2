from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import pyotp
import os

from src.database import get_db
from src import models, schemas
from src.auth import (
    hash_password, verify_password,
    create_access_token, get_current_user,
)

router = APIRouter()


# ── Register ──────────────────────────────────────────────────────────────────

@router.post("/register", response_model=schemas.TokenResponse, status_code=201)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    # Validate password length explicitly (gives a clean 400 instead of 422)
    if len(payload.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long",
        )
    if len(payload.name.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Name must be at least 2 characters long",
        )

    existing = db.query(models.User).filter(
        models.User.email == payload.email.lower().strip()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        hashed_password=hash_password(payload.password),
        role=models.UserRole.user,
        otp_secret=pyotp.random_base32(),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Provision default wallet ($100 000 paper money)
    wallet = models.Wallet(user_id=user.id, balance=100_000.0)
    db.add(wallet)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=schemas.TokenResponse)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(
        models.User.email == form.username.lower().strip()
    ).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended. Contact support.")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}


# ── Admin login (TOTP) ────────────────────────────────────────────────────────

@router.post("/admin-login", response_model=schemas.TokenResponse)
def admin_login(payload: schemas.AdminLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == payload.email.lower().strip()
    ).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.role != models.UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access only")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended")

    # Verify TOTP
    if user.otp_secret:
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(payload.otp, valid_window=1):
            dev_otp = os.getenv("DEV_ADMIN_OTP", "")
            if not dev_otp or payload.otp != dev_otp:
                raise HTTPException(status_code=401, detail="Invalid OTP code")

    import datetime
    token = create_access_token(
        {"sub": str(user.id), "role": "admin"},
        expires_delta=datetime.timedelta(hours=8),
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


# ── Me ────────────────────────────────────────────────────────────────────────

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ── Logout ────────────────────────────────────────────────────────────────────

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


# ── Forgot / Reset password (demo stubs) ─────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(
    payload: schemas.ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    # Always return success to avoid user enumeration
    return {"message": "If an account exists, a reset link has been sent"}


@router.post("/reset-password")
def reset_password(
    payload: schemas.ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    # Demo: token = email (replace with proper signed token in production)
    user = db.query(models.User).filter(
        models.User.email == payload.token
    ).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password reset successful"}
