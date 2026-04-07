'use client';
import { BarChart as RBarchart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BarChartProps {
  data: any[];
  barSize?: number;
  barGap?: number;
}

export default function BarChart({ data, barSize = 12, barGap = 2 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <RBarchart data={data} barSize={barSize} barGap={barGap}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis 
          dataKey="day" 
          tick={{ fill: '#555870', fontSize: 10 }} 
          axisLine={false} 
          tickLine={false} 
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12
          }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          formatter={(value: any, name: string) => [
            '$' + Number(value).toLocaleString(),
            name === 'buy' ? 'Buy Volume' : 'Sell Volume'
          ]}
        />
        <Bar dataKey="buy" fill="#10b981" radius={[2, 2, 0, 0]} />
        <Bar dataKey="sell" fill="#ef4444" radius={[2, 2, 0, 0]} />
      </RBarchart>
    </ResponsiveContainer>
  );
}
