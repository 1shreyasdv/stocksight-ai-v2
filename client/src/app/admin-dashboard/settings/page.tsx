'use client';
import { useState } from 'react';

function ToggleSwitch({ label, description, initial = false }: { label: string; description: string; initial?: boolean }) {
  const [enabled, setEnabled] = useState(initial);

  return (
    <div className="flex items-center justify-between py-4 border-b border-[rgba(255,255,255,0.05)] last:border-0">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-[#555870] mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${enabled ? 'bg-[#22d3a0]' : 'bg-[rgba(255,255,255,0.1)]'}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold">Platform Settings</h1>
        <p className="text-xs text-[#555870] mt-1">Manage global system configurations and toggles</p>
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4 text-[#8b8fa8] uppercase tracking-wider">Platform Core</h2>
        <div className="space-y-1">
          <ToggleSwitch label="Maintenance Mode" description="Suspends all non-admin access to the portal." initial={false} />
          <ToggleSwitch label="User Registration" description="Allow new accounts to be created via the register endpoint." initial={true} />
          <ToggleSwitch label="Global Trading" description="Suspend global order matching and execute-only mode." initial={true} />
        </div>
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4 text-[#8b8fa8] uppercase tracking-wider">Security</h2>
        <div className="space-y-1">
          <ToggleSwitch label="Require 2FA for Admins" description="Force strict 2FA challenges on secure admin token generation." initial={true} />
          <ToggleSwitch label="Strict IP Whitelisting" description="Restrict administrative actions to trusted networks." initial={false} />
          <ToggleSwitch label="Detailed Audit Logging" description="Record high-resolution telemetry of all admin interactions." initial={true} />
        </div>
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4 text-[#8b8fa8] uppercase tracking-wider">Notifications</h2>
        <div className="space-y-1">
          <ToggleSwitch label="System Error Alerts" description="Send emails to root admins upon critical module failure." initial={true} />
          <ToggleSwitch label="Whale Order Watch" description="Receive internal alerts for deposits or orders over $1M." initial={true} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#7c6ff7] hover:bg-[#6a5ced] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Save Configuration
        </button>
        {saved && <span className="text-xs font-semibold text-[#22d3a0]">Settings saved successfully!</span>}
      </div>
    </div>
  );
}
