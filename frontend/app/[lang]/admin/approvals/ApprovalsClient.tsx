"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function ApprovalsClient({ lang }: { lang: string }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(d => setUsers(d.data || [])).catch(() => {});
  }, []);

  const handleAction = async (id: number, action: string) => {
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="p-6" style={{ backgroundColor: "var(--background)" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>User Approvals</h1>
      {users.length === 0 ? (
        <div className="text-center py-20">
          <User className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "var(--text-secondary)" }} />
          <p style={{ color: "var(--text-secondary)" }}>No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(user.id, "approve")} className="p-2 rounded-lg" style={{ color: "var(--success)" }}><CheckCircle className="w-5 h-5" /></button>
                <button onClick={() => handleAction(user.id, "reject")} className="p-2 rounded-lg" style={{ color: "var(--error)" }}><XCircle className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
