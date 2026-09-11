"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { ArrowLeft, Lock, Moon, Sun, Save, Key, CheckCircle } from "lucide-react";

export default function SettingsClient({ lang }: { lang: string }) {
  const { isDarkMode, toggleDarkMode, theme, setTheme, availableThemes, fontFamily, setFontFamily, availableFonts } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
        fetchSettings(u.id || u.email);
      } catch {}
    }
  }, []);

  const fetchSettings = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/settings?user_id=${userId}`);
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.theme) setTheme(data.settings.theme as any);
        if (data.settings.font_family) setFontFamily(data.settings.font_family);
        if (data.settings.dark_mode) {
          // Dark mode apply karo agar saved hai
          if (data.settings.dark_mode === 1 && !isDarkMode) toggleDarkMode();
          if (data.settings.dark_mode === 0 && isDarkMode) toggleDarkMode();
        }
      }
    } catch {}
  };

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user.email,
          theme,
          font_family: fontFamily,
          dark_mode: isDarkMode ? 1 : 0,
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Settings saved to database!");
      } else {
        setMessage("❌ " + (data.error || 'Failed to save'));
      }
    } catch {
      setMessage("❌ Failed to save settings");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords don't match!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setChangingPassword(true);
    const token = localStorage.getItem("auth_token");
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setMessage(data.success ? "✅ Password changed!" : "❌ " + (data.error || "Failed"));
    setChangingPassword(false);
    if (data.success) { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 w-full">
        <div className="max-w-xl mx-auto">
          <Link href={`/${lang}/dashboard`} className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>⚙️ Settings</h1>
          
          {message && (
            <div className="mb-4 p-3 rounded-xl text-white text-sm flex items-center gap-2" style={{ 
              backgroundColor: message.includes("✅") ? "var(--success)" : "var(--error)" 
            }}>
              {message.includes("✅") ? <CheckCircle size={16} /> : null}
              {message}
            </div>
          )}

          <div className="space-y-4">
            {/* Theme Selector */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>🎨 Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value as any)} 
                className="w-full p-2.5 border rounded-lg text-sm" 
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                {availableThemes.map((t: any) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Font Selector */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>✏️ Font Family</label>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm" 
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                {(availableFonts || [{value:"system-ui",label:"System"}]).map((f: any) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>Dark Mode</p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {isDarkMode ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                </div>
                <button onClick={toggleDarkMode} className="px-4 py-2 rounded-lg border text-sm" 
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                  {isDarkMode ? "Light" : "Dark"}
                </button>
              </div>
            </div>

            {/* Save Settings Button */}
            <button onClick={saveSettings} disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-medium"
              style={{ backgroundColor: "var(--primary)", opacity: saving ? 0.7 : 1 }}>
              <Save size={16} /> {saving ? "Saving..." : "Save Settings to Database"}
            </button>

            {/* Change Password */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Key size={18} /> Change Password
              </h3>
              <div className="space-y-3">
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} 
                  placeholder="Current password" className="w-full p-2.5 border rounded-lg text-sm" 
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} 
                  placeholder="New password (min 6 chars)" className="w-full p-2.5 border rounded-lg text-sm" 
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password" className="w-full p-2.5 border rounded-lg text-sm" 
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                <button onClick={handleChangePassword} disabled={changingPassword}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg text-sm font-medium w-full"
                  style={{ backgroundColor: "var(--primary)", opacity: changingPassword ? 0.7 : 1 }}>
                  <Lock size={16} /> {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}