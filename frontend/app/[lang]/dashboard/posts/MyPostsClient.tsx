"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Eye, Edit3, Trash2, ArrowLeft, Clock } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function MyPostsClient({ lang }: { lang: string }) {
  const { themeColors } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    const d = localStorage.getItem("user_data");
    if (d) {
      const u = JSON.parse(d);
      setUser(u);
      fetchPosts(u.email);
    }
  }, []);

  const fetchPosts = async (email: string) => {
    const res = await fetch(`/api/blog/posts?author=${email}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/admin/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    setPosts(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-5xl mx-auto">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <Link href={`/${lang}/dashboard`} className="inline-flex items-center gap-2 text-sm mb-2" style={{ color: textSecondary }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, margin: '0' }}>
                <FileText size={26} style={{ marginRight: '8px', verticalAlign: 'middle', color: primary }} />
                My Posts
              </h1>
              <p style={{ fontSize: '14px', color: textSecondary, marginTop: '4px' }}>Manage your published blog posts</p>
            </div>
            <Link href={`/${lang}/blog`}
              style={{ padding: '12px 24px', background: primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Plus size={18} /> Browse Blog
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: textSecondary }}>Loading your posts...</div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: surface, borderRadius: '16px', border: `1px solid ${border}` }}>
              <FileText size={64} style={{ marginBottom: '16px', opacity: 0.2, color: textSecondary }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>No Posts Yet</h2>
              <p style={{ color: textSecondary, marginBottom: '24px', fontSize: '14px' }}>You haven't written any blog posts yet. Start sharing your knowledge!</p>
              <Link href={`/${lang}/blog`}
                style={{ padding: '12px 28px', background: primary, color: '#fff', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Browse Blog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {posts.map((post: any) => (
                <div key={post.id} style={{ padding: '18px', background: surface, borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: textPrimary, fontSize: '16px', marginBottom: '4px' }}>{post.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                      </span>
                      <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: post.status === 'published' ? '#10b98120' : '#f59e0b20', color: post.status === 'published' ? '#10b981' : '#f59e0b' }}>
                        {post.status || 'draft'}
                      </span>
                      <span style={{ fontSize: '12px', color: textSecondary }}>👁 {post.views || post.view_count || 0} views</span>
                      <span style={{ fontSize: '12px', color: textSecondary }}>❤️ {post.likes || 0} likes</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link href={`/${lang}/blog/${post.slug}`} target="_blank"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: primary, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      <Eye size={14} /> View
                    </Link>
                    <button onClick={() => handleDelete(post.id)}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', color: '#ef4444', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
