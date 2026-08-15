"use client";
import { useState } from "react";
import { Save, Mail, CreditCard, Shield, Globe } from "lucide-react";

export default function SettingsClient({ lang }: { lang: string }) {
  const [settings, setSettings] = useState({ siteName: "Centre.com.pk", siteEmail: "admin@centre.com.pk", currency: "USD", language: "en" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>⚙️ Settings</h1>
          {saved && <div className="mb-4 p-3 rounded-xl text-white" style={{ backgroundColor: "var(--success)" }}>✅ Settings saved!</div>}
          <div className="space-y-4">
            <SettingCard icon={Globe} label="Site Name">
              <input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            </SettingCard>
            <SettingCard icon={Mail} label="Site Email">
              <input value={settings.siteEmail} onChange={e => setSettings({...settings, siteEmail: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            </SettingCard>
            <SettingCard icon={CreditCard} label="Currency">
              <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                <option>USD</option><option>PKR</option><option>EUR</option><option>GBP</option>
              </select>
            </SettingCard>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium" style={{ backgroundColor: "var(--primary)" }}><Save className="w-4 h-4" /> Save Settings</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingCard({ icon: Icon, label, children }: any) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}><Icon className="w-4 h-4" />{label}</label>
      {children}
    </div>
  );
}
