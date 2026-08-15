"use client";
import { useState, useEffect } from "react";
import ProSidebar from "@/components/dashboard/pro/ProSidebar";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { Search, Edit, Trash2, Shield, X, Save, Filter } from "lucide-react";

export default function UsersClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user", plan: "free", status: "active" });
  const [message, setMessage] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?action=list");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({ name: user.name || "", email: user.email || "", role: user.role || "user", plan: user.plan || "free", status: user.status || "active" });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit", id: editingUser.id, ...editForm }),
    });
    setShowEditModal(false);
    setMessage("✅ User updated!");
    fetchUsers();
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchUsers();
  };

  const filtered = users.filter((u: any) => {
    const matchSearch = (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || u.plan === filterPlan;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchPlan && matchStatus;
  });

  if (loading) return <div className="flex min-h-screen"><ProSidebar lang={lang} role="admin" /><main className="flex-1 p-6 pt-16 lg:pt-6"><div className="animate-pulse" style={{ color: "var(--text-secondary)" }}>Loading...</div></main></div>;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)", direction: isRTL ? "rtl" : "ltr" }}>
      <ProSidebar lang={lang} role="admin" />
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>👥 User Manager</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{users.length} total users</p>

          {message && <div className="mb-4 p-3 rounded-xl text-white" style={{ backgroundColor: "var(--success)" }}>{message}</div>}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
            </div>
            <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
              <option value="all">All Plans</option>
              <option value="free">Free</option><option value="pro">Pro</option><option value="premium">Premium</option><option value="lifetime">Lifetime</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
              <option value="all">All Status</option>
              <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--surface)" }}>
                <tr>
                  <th className="p-3 text-left">User</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Plan</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Joined</th><th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user: any) => (
                  <tr key={user.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3 font-medium" style={{ color: "var(--text-primary)" }}>{user.name}</td>
                    <td className="p-3" style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: user.role === "admin" ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)", color: user.role === "admin" ? "#ef4444" : "#3b82f6" }}>{user.role || "user"}</span></td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>{user.plan || "free"}</span></td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs" style={{ color: user.status === "active" ? "var(--success)" : "var(--warning)" }}>{user.status || "active"}</span></td>
                    <td className="p-3 text-xs" style={{ color: "var(--text-secondary)" }}>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(user)} className="p-1.5 rounded-lg" style={{ color: "var(--primary)" }}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg" style={{ color: "var(--error)" }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEditModal(false)}>
          <div className="w-full max-w-md p-6 rounded-xl mx-4" style={{ backgroundColor: "var(--surface)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Edit User</h2>
              <button onClick={() => setShowEditModal(false)} style={{ color: "var(--text-secondary)" }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Name" className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
              <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email" className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
              <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                <option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option>
              </select>
              <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                <option value="free">Free</option><option value="pro">Pro</option><option value="premium">Premium</option><option value="lifetime">Lifetime</option>
              </select>
              <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
              </select>
              <button onClick={handleSave} className="w-full py-2.5 text-white rounded-lg font-medium" style={{ backgroundColor: "var(--primary)" }}><Save className="w-4 h-4 inline mr-2" />Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
