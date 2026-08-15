"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Trash2 } from "lucide-react";

export default function PostsClient() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts?action=list")
      .then(r => r.json()).then(d => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    setPosts(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="p-6" style={{ minHeight: "100vh" }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>📝 Posts ({posts.length})</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2" style={{ backgroundColor: "var(--primary)" }}>
          <Plus size={16} /> New Post
        </Link>
      </div>
      
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--surface)" }}>
            <tr>
              <th className="p-3 text-left" style={{ color: "var(--text-secondary)" }}>Title</th>
              <th className="p-3 text-left" style={{ color: "var(--text-secondary)" }}>Status</th>
              <th className="p-3 text-left" style={{ color: "var(--text-secondary)" }}>Date</th>
              <th className="p-3 text-left" style={{ color: "var(--text-secondary)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => (
              <tr key={p.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="p-3 font-medium" style={{ color: "var(--text-primary)" }}>{p.title}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
                    color: p.status === 'published' ? 'var(--success)' : 'var(--warning)',
                    backgroundColor: p.status === 'published' ? '#10b98120' : '#f59e0b20'
                  }}>{p.status || 'draft'}</span>
                </td>
                <td className="p-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/blog/${p.slug}`} target="_blank" 
                      className="p-1.5 rounded-lg border" 
                      style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
                      <Eye size={14} />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} 
                      className="p-1.5 rounded-lg border" 
                      style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center" style={{ color: "var(--text-secondary)" }}>
                  No posts found. <Link href="/admin/posts/new" style={{ color: "var(--primary)" }}>Create your first post</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
