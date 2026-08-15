"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function PostsClient({ lang }: { lang: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts?action=list").then(r => r.json()).then(d => setPosts(d.posts || [])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    setPosts(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>📝 Post Manager</h1>
            <Link href={`/${lang}/admin/posts/new`} className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-medium" style={{ backgroundColor: "var(--primary)" }}><Plus className="w-4 h-4" />New Post</Link>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--surface)" }}>
                <tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Actions</th></tr>
              </thead>
              <tbody>
                {posts.map((post: any) => (
                  <tr key={post.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="p-3" style={{ color: "var(--text-primary)" }}>{post.title}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full text-xs" style={{ color: post.status === "published" ? "var(--success)" : "var(--warning)" }}>{post.status}</span></td>
                    <td className="p-3 text-xs" style={{ color: "var(--text-secondary)" }}>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "-"}</td>
                    <td className="p-3"><div className="flex gap-2">
                      <Link href={`/${lang}/blog/${post.slug}`} target="_blank" className="p-1.5 rounded-lg" style={{ color: "var(--primary)" }}><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg" style={{ color: "var(--error)" }}><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
