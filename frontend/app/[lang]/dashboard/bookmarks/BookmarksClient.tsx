"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Trash2, FileText, Globe, Calendar } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function BookmarksClient({ lang }: { lang: string }) {
  const { themeColors } = useTheme();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
        fetchBookmarks(u.id || u.email);
      } catch {}
    }
  }, []);

  const fetchBookmarks = async (userId: string) => {
    setLoading(true);
    try {
      // API se bookmarks fetch karo
      const res = await fetch(`/api/user/bookmarks?user_id=${userId}`);
      const data = await res.json();
      
      if (data.bookmarks && data.bookmarks.length > 0) {
        // Har bookmark ke liye post details fetch karo
        const enrichedBookmarks = await Promise.all(
          data.bookmarks.map(async (b: any) => {
            try {
              const postRes = await fetch(`/api/blog/${b.post_slug}?lang=${lang}`);
              const postData = await postRes.json();
              return { ...b, post: postData.post || null };
            } catch {
              return { ...b, post: null };
            }
          })
        );
        setBookmarks(enrichedBookmarks.filter(b => b.post !== null));
      } else {
        setBookmarks([]);
      }
    } catch {
      setBookmarks([]);
    }
    setLoading(false);
  };

  const removeBookmark = async (postSlug: string) => {
    if (!user) return;
    try {
      await fetch('/api/blog/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, userId: user.id || user.email }),
      });
      setBookmarks(prev => prev.filter(b => b.post_slug !== postSlug));
    } catch {}
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href={`/${lang}/dashboard`} className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: textSecondary }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: textPrimary }}>🔖 Bookmarks</h1>
              <p style={{ color: textSecondary, fontSize: '14px' }}>
                {bookmarks.length} saved posts
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>
              Loading bookmarks...
            </div>
          ) : bookmarks.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: textSecondary }} />
              <p style={{ color: textSecondary, fontSize: '16px', marginBottom: '8px' }}>No bookmarks yet</p>
              <p style={{ color: textSecondary, fontSize: '13px' }}>Save your favorite blog posts for quick access!</p>
              <Link href={`/${lang}/blog`} style={{ 
                display: 'inline-block', marginTop: '16px', padding: '10px 20px',
                background: primary, color: '#fff', borderRadius: '8px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 600
              }}>
                Browse Blog Posts
              </Link>
            </div>
          ) : (
            /* Bookmarks List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bookmarks.map((bookmark: any) => {
                const post = bookmark.post;
                return (
                  <div key={bookmark.id} style={{ 
                    padding: '16px', background: surface, borderRadius: '12px', 
                    border: `1px solid ${border}`,
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    transition: 'all 0.2s ease',
                  }}>
                    {/* Thumbnail */}
                    {post.featured_image && (
                      <img src={post.featured_image} alt={post.title} style={{ 
                        width: '80px', height: '60px', borderRadius: '8px', 
                        objectFit: 'cover', flexShrink: 0 
                      }} />
                    )}

                    {/* Post Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/${lang}/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ fontWeight: 600, color: textPrimary, fontSize: '15px', marginBottom: '4px' }}>
                          {post.title}
                        </div>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                        </span>
                        <span style={{ fontSize: '11px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Globe size={11} /> {(post.lang || 'en').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <Link href={`/${lang}/blog/${post.slug}`} style={{ 
                        padding: '6px 10px', borderRadius: '6px', 
                        border: `1px solid ${border}`, background: 'transparent', 
                        color: textSecondary, textDecoration: 'none',
                        display: 'flex', alignItems: 'center'
                      }}>
                        <FileText size={14} />
                      </Link>
                      <button onClick={() => removeBookmark(bookmark.post_slug)} style={{ 
                        padding: '6px 10px', borderRadius: '6px', 
                        border: '1px solid #ef4444', background: '#ef444410', 
                        color: '#ef4444', cursor: 'pointer',
                        display: 'flex', alignItems: 'center'
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}