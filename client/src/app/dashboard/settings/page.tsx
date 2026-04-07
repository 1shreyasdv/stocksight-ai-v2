'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [aiSignals, setAiSignals] = useState(true);
  const [twoFa, setTwoFa] = useState(false);

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-xs text-[#555870] mt-1">Manage your account preferences and security</p>
      </div>

      {[
        {
          title: 'Profile', items: [
            { label: 'Full Name', type: 'text', val: 'Alex Rivera' },
            { label: 'Email', type: 'email', val: 'alex@kineticledger.com' },
          ]
        },
        {
          title: 'Security', items: [
            { label: 'Current Password', type: 'password', val: '' },
            { label: 'New Password', type: 'password', val: '' },
          ]
        }
      ].map(section => (
        <div key={section.title} className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
          <div className="font-semibold mb-4">{section.title}</div>
          <div className="space-y-3">
            {section.items.map(item => (
              <div key={item.label}>
                <label className="block text-[10px] uppercase tracking-wider text-[#555870] mb-1.5 font-semibold">{item.label}</label>
                <input type={item.type} defaultValue={item.val}
                  className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7c6ff7] transition-colors" />
              </div>
            ))}
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}>
              Save {section.title}
            </button>
          </div>
        </div>
      ))}

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
        <div className="font-semibold mb-4">Preferences</div>
        <div className="space-y-4">
          {[
            { label: 'Price Alert Notifications', sub: 'Get notified when your watchlist moves significantly', val: notifications, set: setNotifications },
            { label: 'AI Signal Alerts', sub: 'Receive buy/sell signals from the TradeBrain engine', val: aiSignals, set: setAiSignals },
            { label: 'Two-Factor Authentication', sub: 'Add an extra layer of security to your account', val: twoFa, set: setTwoFa },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{p.label}</div>
                <div className="text-xs text-[#555870] mt-0.5">{p.sub}</div>
              </div>
              <button onClick={() => p.set(!p.val)}
                className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ background: p.val ? '#7c6ff7' : 'rgba(255,255,255,0.1)' }}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${p.val ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
