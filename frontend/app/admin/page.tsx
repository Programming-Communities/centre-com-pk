import { Metadata } from "next";

export const metadata: Metadata = { title: "Admin - Centre.com.pk" };

export default function AdminPage() {
  return (
    <div className="p-8" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/posts" className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <h2 className="text-lg font-semibold">Posts</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage blog posts</p>
        </a>
        <a href="/admin/comments" className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <h2 className="text-lg font-semibold">Comments</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage comments</p>
        </a>
        <a href="/admin/users" className="p-6 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <h2 className="text-lg font-semibold">Users</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage users</p>
        </a>
      </div>
    </div>
  );
}
