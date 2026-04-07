# StockSight AI — Kinetic Ledger

An AI-powered stock trading insights platform with real-time market data, candlestick charts, portfolio management, and ML-driven buy/sell signals.

## Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS → Vercel
- **Backend**: FastAPI (Python) + SQLAlchemy → Render
- **Database**: MySQL → Railway

## Screens
1. User Login
2. User Register (3-step)
3. Admin Terminal (MFA/OTP)
4. Admin Dashboard (revenue, users, trading volume)
5. User Dashboard (portfolio, live charts, AI signals, order panel)

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/1shreyasdv/stocksight-ai.git
cd stocksight-ai
npm run install:all
```

### 2. Environment Variables

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=StockSight AI
```

**server/.env**
```
DATABASE_URL=mysql+pymysql://user:password@host:port/stocksight
JWT_SECRET=your_super_secret_key_here
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
ADMIN_SECRET=your_admin_secret
CORS_ORIGIN=http://localhost:3000
PORT=8000
```

### 3. Run
```bash
# Terminal 1 — Frontend
cd client && npm run dev

# Terminal 2 — Backend
cd server && uvicorn src.main:app --reload --port 8000
```

## Deployment

### Frontend → Vercel
```bash
cd client
vercel --prod
```

### Backend → Render
- Connect your GitHub repo
- Set Root Directory: `server`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Database → Railway
- New Project → MySQL
- Copy the `DATABASE_URL` from Railway dashboard into Render env vars
