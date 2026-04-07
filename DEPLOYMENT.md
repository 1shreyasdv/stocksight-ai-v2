# StockSight AI — Complete Deployment Guide
# GitHub: https://github.com/1shreyasdv/stocksight-ai

## Step 1 — Push to GitHub

```bash
cd stocksight-ai
git init
git add .
git commit -m "feat: initial StockSight AI full-stack application"
git branch -M main
git remote add origin https://github.com/1shreyasdv/stocksight-ai.git
git push -u origin main
```

---

## Step 2 — Railway (MySQL Database)

1. Go to https://railway.app → New Project → Add Service → MySQL
2. Wait for MySQL to provision
3. Click the MySQL service → **Variables** tab
4. Copy the `DATABASE_URL` — it looks like:
   ```
   mysql://root:PASSWORD@monorail.proxy.rlwy.net:PORT/railway
   ```
5. Change `mysql://` → `mysql+pymysql://` for SQLAlchemy compatibility

**Your DATABASE_URL for Render:**
```
mysql+pymysql://root:PASSWORD@monorail.proxy.rlwy.net:PORT/railway
```

---

## Step 3 — Render (FastAPI Backend)

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo: `1shreyasdv/stocksight-ai`
3. Configure:
   - **Name**: `stocksight-backend`
   - **Root Directory**: `server`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`

4. Add Environment Variables:
   ```
   DATABASE_URL       = mysql+pymysql://root:...@railway-host/railway
   JWT_SECRET         = <generate 64-char random string>
   ADMIN_SECRET       = <your admin secret>
   CORS_ORIGIN        = https://stocksight-ai-1shreyasdv.vercel.app
   ENVIRONMENT        = production
   DEV_ADMIN_OTP      = 123456   # For testing — remove in production
   ```

5. Deploy → copy your Render URL (e.g. `https://stocksight-backend-xxxx.onrender.com`)

**Create the first admin user via Railway console or Render shell:**
```python
# In Render Shell:
python3 -c "
from src.database import SessionLocal
from src import models
from src.auth import hash_password
import pyotp

db = SessionLocal()
admin = models.User(
    name='Admin',
    email='admin@stocksight.ai',
    hashed_password=hash_password('AdminPass123!'),
    role=models.UserRole.admin,
    otp_secret=pyotp.random_base32(),
)
db.add(admin)
db.commit()
print('Admin created. OTP secret:', admin.otp_secret)
"
```

Then use a TOTP app (Google Authenticator / Authy) to scan the secret, or use the `DEV_ADMIN_OTP` env var for testing.

---

## Step 4 — Vercel (Next.js Frontend)

```bash
cd client
npx vercel login
npx vercel --prod
```

Or via Vercel Dashboard:
1. New Project → Import from GitHub: `1shreyasdv/stocksight-ai`
2. **Root Directory**: `client`
3. **Framework Preset**: Next.js
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://stocksight-backend-xxxx.onrender.com
   ```
5. Deploy!

**Your live URL will be**: `https://stocksight-ai.vercel.app`

---

## Step 5 — Update CORS on Render

After Vercel gives you the URL, update the Render env var:
```
CORS_ORIGIN = https://stocksight-ai.vercel.app
```

Then redeploy Render service.

---

## Ports & Endpoints Summary

| Service  | URL                                              |
|----------|--------------------------------------------------|
| Frontend | https://stocksight-ai.vercel.app                |
| Backend  | https://stocksight-backend-ljfa.onrender.com     |
| API Docs | https://stocksight-backend-ljfa.onrender.com/docs|
| Database | Railway internal MySQL                           |

## API Endpoints

| Method | Path                    | Auth     | Description              |
|--------|-------------------------|----------|--------------------------|
| POST   | /auth/register          | Public   | Create user account      |
| POST   | /auth/login             | Public   | OAuth2 login             |
| POST   | /auth/admin-login       | Public   | Admin MFA login          |
| GET    | /auth/me                | JWT      | Current user profile     |
| GET    | /stocks/                | JWT      | List all 30 stocks       |
| GET    | /stocks/{symbol}        | JWT      | Single stock detail      |
| GET    | /stocks/{symbol}/candles| JWT      | OHLCV candlestick data   |
| GET    | /stocks/{symbol}/signal | JWT      | AI signal for symbol     |
| POST   | /orders/                | JWT      | Place buy/sell order     |
| GET    | /orders/                | JWT      | User order history       |
| GET    | /users/portfolio        | JWT      | User portfolio holdings  |
| GET    | /users/watchlist        | JWT      | User watchlist           |
| GET    | /admin/stats            | Admin    | Platform statistics      |
| GET    | /admin/users            | Admin    | All users list           |
| PUT    | /admin/users/{id}/status| Admin    | Ban/activate user        |
| GET    | /admin/orders           | Admin    | All platform orders      |
