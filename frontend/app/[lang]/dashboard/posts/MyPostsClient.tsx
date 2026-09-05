"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Eye, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      published: { bg: '#10b98120', color: '#10b981', icon: CheckCircle, label: 'Published' },
      pending: { bg: '#f59e0b20', color: '#f59e0b', icon: Clock, label: 'Pending Approval' },
      draft: { bg: '#64748b20', color: '#64748b', icon: AlertCircle, label: 'Draft' },
      rejected: { bg: '#ef444420', color: '#ef4444', icon: XCircle, label: 'Rejected' },
    };
    return configs[status] || configs.draft;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 0' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '20px' }}>
        <Link href={`/${lang}/dashboard`} className="inline-flex items-center gap-1.5 text-sm mb-1" style={{ color: textSecondary, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: textPrimary, margin: '0' }}>
          📝 My Posts
        </h1>
        <p style={{ fontSize: '13px', color: textSecondary, marginTop: '2px' }}>
          {posts.length} total posts
        </p>
      </div>

      {/* POSTS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>Loading your posts...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 16px', background: surface, borderRadius: '14px', border: `1px solid ${border}` }}>
          <FileText size={48} style={{ marginBottom: '12px', opacity: 0.2, color: textSecondary }} />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '6px' }}>No Posts Yet</h2>
          <p style={{ color: textSecondary, marginBottom: '16px', fontSize: '13px' }}>Your published posts will appear here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map((post: any) => {
            const statusConfig = getStatusBadge(post.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={post.id} style={{ padding: '14px', background: surface, borderRadius: '12px', border: `1px solid ${border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 600, color: textPrimary, fontSize: '15px', marginBottom: '4px' }}>
                      {post.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, 
                        background: statusConfig.bg, color: statusConfig.color, 
                        display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <StatusIcon size={11} /> {statusConfig.label}
                      </span>
                      <span style={{ fontSize: '11px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                      </span>
                      <span style={{ fontSize: '11px', color: textSecondary }}>👁 {post.views || post.view_count || 0} views</span>
                    </div>
                  </div>
                  
                  {/* VIEW ONLY — NO DELETE */}
                  <Link href={`/${lang}/blog/${post.slug}`} target="_blank"
                    style={{ padding: '7px 14px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: primary, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', flexShrink: 0 }}>
                    <Eye size={13} /> View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
