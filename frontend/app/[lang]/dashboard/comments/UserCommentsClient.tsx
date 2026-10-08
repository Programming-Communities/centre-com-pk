"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Trash2, FileText, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function UserCommentsClient({ lang }: { lang: string }) {
  const { themeColors } = useTheme();
  const [comments, setComments] = useState<any[]>([]);
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
        fetchUserComments(u.id || u.email);
      } catch {}
    }
  }, []);

  const fetchUserComments = async (userId: string) => {
    setLoading(true);
    try {
      // API se comments fetch karo
      const res = await fetch('/api/me/comments');
      const data = await res.json();
      
      if (data.comments && data.comments.length > 0) {
        // Sirf current user ke comments filter karo
        const userComments = data.comments.filter((c: any) => 
          c.user_id == userId || c.guest_email === userId
        );
        setComments(userComments);
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }
    setLoading(false);
  };

  const deleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await fetch(`/api/comments?id=${commentId}&user_id=${user.id || user.email}`, { 
        method: 'DELETE' 
      });
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      approved: { bg: '#10b98120', color: '#10b981', icon: CheckCircle, label: 'Approved' },
      pending: { bg: '#f59e0b20', color: '#f59e0b', icon: Clock, label: 'Pending' },
      spam: { bg: '#ef444420', color: '#ef4444', icon: XCircle, label: 'Spam' },
      trash: { bg: '#64748b20', color: '#64748b', icon: XCircle, label: 'Trash' },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span style={{ 
        padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
        background: config.bg, color: config.color,
        display: 'inline-flex', alignItems: 'center', gap: '4px'
      }}>
        <Icon size={12} /> {config.label}
      </span>
    );
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
          <div style={{ marginBottom: '24px' }}>
            <h1 className="text-2xl font-bold mb-1" style={{ color: textPrimary }}>💬 My Comments</h1>
            <p style={{ color: textSecondary, fontSize: '14px' }}>
              {comments.length} total comments
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: textSecondary }} />
              <p style={{ color: textSecondary, fontSize: '16px', marginBottom: '8px' }}>No comments yet</p>
              <p style={{ color: textSecondary, fontSize: '13px' }}>Your comments on blog posts will appear here!</p>
              <Link href={`/${lang}/blog`} style={{ 
                display: 'inline-block', marginTop: '16px', padding: '10px 20px',
                background: primary, color: '#fff', borderRadius: '8px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 600
              }}>
                Browse Blog Posts
              </Link>
            </div>
          ) : (
            /* Comments List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map((comment: any) => (
                <div key={comment.id} style={{ 
                  padding: '16px', background: surface, borderRadius: '12px', 
                  border: `1px solid ${border}`,
                }}>
                  {/* Comment Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: textPrimary, fontSize: '15px', marginBottom: '2px' }}>
                        {comment.guest_name || comment.user?.name || 'Anonymous'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} /> {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '-'}
                        </span>
                        {getStatusBadge(comment.status || 'pending')}
                      </div>
                    </div>
                    {/* Delete Button */}
                    <button onClick={() => deleteComment(comment.id)} style={{ 
                      padding: '6px 10px', borderRadius: '6px', 
                      border: '1px solid #ef4444', background: '#ef444410', 
                      color: '#ef4444', cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center'
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Comment Content */}
                  <div style={{ 
                    padding: '12px', background: 'var(--background)', 
                    borderRadius: '8px', marginBottom: '10px'
                  }}>
                    <p style={{ color: textPrimary, fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                      {comment.content}
                    </p>
                  </div>

                  {/* Post Link (agar available) */}
                  {comment.post_slug && (
                    <Link href={`/${lang}/blog/${comment.post_slug}`} style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '12px', color: primary, textDecoration: 'none',
                      fontWeight: 500
                    }}>
                      <FileText size={12} /> View Post
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}