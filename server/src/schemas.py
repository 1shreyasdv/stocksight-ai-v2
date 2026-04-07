from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ─── Auth ───────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    username: str  # OAuth2 form uses 'username'
    password: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str
    otp: str = Field(..., min_length=6, max_length=6)


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    portfolio_value: float
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


# ─── Stocks ─────────────────────────────────────────────────────────────
class StockOut(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_pct: float
    volume: str
    market_cap: str
    sector: str
    status: str
    logo_color: str
    logo_letter: str
    ai_signal: Optional[str] = None
    ai_reason: Optional[str] = None
    confidence: Optional[int] = None
    rsi: Optional[float] = None
    ma50: Optional[float] = None
    ma200: Optional[float] = None
    high_52w: Optional[float] = None
    low_52w: Optional[float] = None


class CandleOut(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: int


# ─── Orders ─────────────────────────────────────────────────────────────
class OrderCreate(BaseModel):
    symbol: str
    name: Optional[str] = None
    order_type: str  # buy | sell | BUY | SELL
    trade_type: str = "MARKET"
    quantity: float = Field(..., gt=0)
    price: float = Field(..., gt=0)


class OrderOut(BaseModel):
    id: int
    symbol: str
    name: str
    order_type: str
    trade_type: str
    quantity: float
    price: float
    total: float
    fee: float
    status: str
    ai_signal: Optional[str]
    user: Optional[UserOut] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Portfolio ──────────────────────────────────────────────────────────
class PortfolioOut(BaseModel):
    id: int
    symbol: str
    name: str
    quantity: float
    avg_price: float
    logo_color: str
    logo_letter: str

    class Config:
        from_attributes = True


# ─── Admin ──────────────────────────────────────────────────────────────
class AdminStatsOut(BaseModel):
    total_revenue: float
    total_users: int
    active_traders: int
    revenue_change: float
    users_change: float
    traders_change: float
    total_orders: int
    total_volume: float


class UserAdminOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    portfolio_value: float
    created_at: datetime

    class Config:
        from_attributes = True


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserRoleUpdate(BaseModel):
    role: str


# ─── Alerts ─────────────────────────────────────────────────────────────
class PriceAlertCreate(BaseModel):
    symbol: str
    target_price: float = Field(..., gt=0)
    condition: str = "ABOVE"


class PriceAlertOut(BaseModel):
    id: int
    symbol: str
    target_price: float
    condition: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
