// Auth
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  portfolio_value?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Stocks
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  volume: string;
  market_cap: string;
  sector: string;
  status: 'active' | 'hold' | 'sell';
  logo_color: string;
  logo_letter: string;
  ai_signal?: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  ai_reason?: string;
  confidence?: number;
  rsi?: number;
  ma50?: number;
  ma200?: number;
  high_52w?: number;
  low_52w?: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Orders
export interface Order {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  created_at: string;
}

export interface PlaceOrderPayload {
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  order_type: 'MARKET' | 'LIMIT' | 'STOP_LOSS';
}

// Portfolio
export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  gain_loss: number;
  gain_loss_pct: number;
  logo_color: string;
  logo_letter: string;
}

// Admin
export interface AdminStats {
  total_revenue: number;
  total_users: number;
  active_traders: number;
  revenue_change: number;
  users_change: number;
  traders_change: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number;
}
