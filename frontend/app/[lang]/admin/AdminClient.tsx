"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminClient() {
  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0, tools: 53 });

  useEffect(() => {
    fetch("/api/admin/dashboard-stats").then(r => r.json()).then(d => setStats({
      users: d.totalUsers || 0,
      posts: d.totalPosts || 0,
      comments: d.totalComments || 0,
      tools: d.totalTools || 53
    })).catch(() => {});
  }, []);

  return (
    <div className="p-8" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Users" value={stats.users} color="#3b82f6" />
        <StatCard label="Posts" value={stats.posts} color="#10b981" />
        <StatCard label="Comments" value={stats.comments} color="#f59e0b" />
        <StatCard label="Tools" value={stats.tools} color="#8b5cf6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/dashboard/users" className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>👥 User Manager</Link>
        <Link href="/admin/dashboard/posts" className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>📝 Post Manager</Link>
        <Link href="/admin/tools-manager" className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>🛠️ Tools Manager</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}
