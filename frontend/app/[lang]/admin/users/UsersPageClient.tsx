"use client";
import { useState, useEffect } from "react";

export default function UsersPageClient() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(d => {
      setUsers(d.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8" style={{ color: "var(--text-secondary)" }}>Loading users...</div>;

  return (
    <div className="p-6" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <h1 className="text-2xl font-bold mb-4">Users ({users.length})</h1>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--surface)" }}>
            <tr>
              <th className="p-3 text-left">ID</th><th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Plan</th><th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3" style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                <td className="p-3">{u.role || "user"}</td>
                <td className="p-3">{u.plan || "free"}</td>
                <td className="p-3" style={{ color: u.status === "active" ? "var(--success)" : "var(--warning)" }}>{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
