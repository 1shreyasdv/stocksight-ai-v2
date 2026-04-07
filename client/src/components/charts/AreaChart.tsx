'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: { time: string; close: number }[];
  color?: string;
}

export default function StockAreaChart({ data, color = '#6366f1' }: Props) {
  if (!data || data.length === 0) return (
    <div style={{ 
      height: 240, display: 'flex', 
      alignItems: 'center', justifyContent: 'center',
      color: '#666', fontSize: 14 
    }}>
      No chart data available
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis 
          dataKey="time" 
          tick={{ fill: '#888', fontSize: 11 }} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(v: string) => v && v.length > 5 ? v.slice(5) : v} 
        />
        <YAxis 
          tick={{ fill: '#888', fontSize: 11 }} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(v: number) => '$' + v.toLocaleString()} 
          domain={['auto', 'auto']} 
          width={70} 
        />
        <Tooltip
          active={undefined}
          contentStyle={{ 
            background: '#1a1a2e', 
            border: '1px solid #6366f1',
            borderRadius: 8, 
            color: '#fff', 
            fontSize: 12,
            padding: '8px 12px'
          }}
          labelStyle={{ color: '#888', marginBottom: 4 }}
          formatter={(value: any) => ['$' + Number(value).toLocaleString(), 'Price']}
          labelFormatter={(label: any) => 'Date: ' + label}
        />
        <Area 
          type="monotone" 
          dataKey="close" 
          stroke={color} 
          strokeWidth={2} 
          fill="url(#colorGrad)" 
          dot={false} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
