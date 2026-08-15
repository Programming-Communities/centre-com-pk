"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, Save, ArrowLeft } from "lucide-react";

export default function ProfileClient({ lang }: { lang: string }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const d = localStorage.getItem("user_data");
    if (!d) { router.push("/" + lang + "/auth/signin"); return; }
    const u = JSON.parse(d);
    setUser(u); setName(u.name || ""); setBio(u.bio || "");
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("auth_token");
    await fetch("/api/user/profile", { method: "POST", headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ name, bio }) });
    const updated = { ...user, name, bio };
    localStorage.setItem("user_data", JSON.stringify(updated));
    setUser(updated);
    setMessage("✅ Profile updated!");
    setSaving(false);
    setTimeout(() => setMessage(""), 2000);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-6 pt-16 lg:pt-6 w-full">
        <div className="max-w-xl mx-auto">
          <Link href={"/" + lang + "/dashboard"} className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}><ArrowLeft size={16} /> Back</Link>
          <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Profile Settings</h1>
          {message && <div className="mb-4 p-3 rounded-xl text-white text-sm" style={{ backgroundColor: "var(--success)" }}>{message}</div>}
          <div className="rounded-xl border p-6 space-y-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input value={user.email} disabled className="w-full p-3 border rounded-xl opacity-60" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Plan</label>
              <input value={(user.plan || "free").toUpperCase()} disabled className="w-full p-3 border rounded-xl font-semibold" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--primary)" }} />
            </div>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full p-3 border rounded-xl resize-none" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            </div>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium" style={{ backgroundColor: "var(--primary)" }}><Save size={16} /> {saving ? "Saving..." : "Save Profile"}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
