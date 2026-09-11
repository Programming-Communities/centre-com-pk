'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, Search, Edit3, Eye, Trash2, FileText, Globe, Calendar } from 'lucide-react';
import QuickEdit from '@/components/admin/QuickEdit';
import BulkActions from '@/components/admin/BulkActions';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function PostsClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [quickEditPost, setQuickEditPost] = useState<any>(null);

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/blog?${params.toString()}`);
    const data = await res.json();
    if (data.success) setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedPosts.length} posts?`)) return;
    for (const id of selectedPosts) {
      await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    }
    setSelectedPosts([]);
    fetchPosts();
  };

  const filteredPosts = posts.filter((p: any) => {
    if (filterLang && p.lang !== filterLang) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: `1px solid ${border}`,
    borderRadius: '8px',
    fontSize: '12px',
    backgroundColor: surface,
    color: textPrimary,
    outline: 'none',
  };

  const getStatusStyle = (status: string) => {
    if (status === 'published') {
      return { bg: '#10b98115', color: '#10b981', label: 'Published' };
    }
    if (status === 'draft') {
      return { bg: '#64748b15', color: '#64748b', label: 'Draft' };
    }
    return { bg: '#f59e0b15', color: '#f59e0b', label: status };
  };

  const getLangBadge = (post: any) => {
    const langs = post.available_langs || [post.lang || 'en'];
    return langs.map(l => l.toUpperCase()).join(', ');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 0' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: textPrimary, margin: 0 }}>
            📝 Posts
          </h1>
          <p style={{ fontSize: '12px', color: textSecondary, margin: '2px 0 0' }}>
            {posts.length} total posts
          </p>
        </div>
        <Link href={`/${lang}/admin/posts/new`} style={{
          padding: '8px 16px', backgroundColor: primary, color: '#fff', borderRadius: '8px',
          textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Plus size={15} /> Add New Post
        </Link>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={filterLang} onChange={e => setFilterLang(e.target.value)} style={inputStyle}>
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="ur">Urdu</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
        </select>
        <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }} />
        </div>
        <span style={{ fontSize: '12px', color: textSecondary }}>{filteredPosts.length} items</span>
      </div>

      {/* BULK ACTIONS */}
      {selectedPosts.length > 0 && (
        <BulkActions count={selectedPosts.length} onDelete={handleBulkDelete} onClear={() => setSelectedPosts([])} />
      )}

      {/* POSTS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 16px', background: surface, borderRadius: '12px', border: `1px solid ${border}` }}>
          <FileText size={40} style={{ marginBottom: '10px', opacity: 0.2, color: textSecondary }} />
          <p style={{ fontSize: '14px', color: textSecondary, margin: 0 }}>No posts found</p>
        </div>
      ) : (
        <>
          {/* ========== MOBILE CARDS — < 640px ========== */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPosts.map((post: any) => {
              const statusStyle = getStatusStyle(post.status);
              const langBadge = getLangBadge(post);

              return (
                <div key={post.id} style={{ 
                  padding: '16px', 
                  background: surface, 
                  borderRadius: '12px', 
                  border: `1px solid ${border}` 
                }}>
                  {/* Checkbox + Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <input type="checkbox" checked={selectedPosts.includes(post.id)}
                      onChange={e => {
                        setSelectedPosts(e.target.checked ? [...selectedPosts, post.id] : selectedPosts.filter(id => id !== post.id));
                      }}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: textPrimary, marginBottom: '6px', lineHeight: 1.3 }}>
                        {post.title || '(no title)'}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px', paddingLeft: '26px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                      {statusStyle.label}
                    </span>
                    <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, background: `${primary}15`, color: primary, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Globe size={10} /> {langBadge}
                    </span>
                    <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, background: 'var(--surface)', color: textSecondary, border: `1px solid ${border}` }}>
                      {post.category || '—'}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: '11px', color: textSecondary, marginBottom: '12px', paddingLeft: '26px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </div>

                  {/* Actions */}
                  <div style={{ paddingTop: '12px', borderTop: `1px solid ${border}`, display: 'flex', gap: '8px' }}>
                    <button onClick={() => setQuickEditPost(post)} style={{ 
                      flex: 1, padding: '8px 10px', borderRadius: '8px', border: `1px solid ${primary}`, 
                      background: 'transparent', color: primary, fontSize: '11px', fontWeight: 600, cursor: 'pointer' 
                    }}>
                      Quick Edit
                    </button>
                    <Link href={`/${lang}/admin/posts/${post.id}`} style={{ 
                      padding: '8px 10px', borderRadius: '8px', border: `1px solid ${border}`, 
                      background: 'transparent', color: textSecondary, textDecoration: 'none', display: 'flex', alignItems: 'center' 
                    }}>
                      <Edit3 size={14} />
                    </Link>
                    <Link href={`/${lang}/blog/${post.slug}`} target="_blank" style={{ 
                      padding: '8px 10px', borderRadius: '8px', border: `1px solid ${border}`, 
                      background: 'transparent', color: textSecondary, textDecoration: 'none', display: 'flex', alignItems: 'center' 
                    }}>
                      <Eye size={14} />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} style={{ 
                      padding: '8px 10px', borderRadius: '8px', border: '1px solid #ef4444', 
                      background: '#ef444410', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' 
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>
                No posts found
              </div>
            )}
          </div>

          {/* ========== DESKTOP TABLE — > 640px ========== */}
          <div className="hidden md:block" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredPosts.map((post: any) => {
              const statusStyle = getStatusStyle(post.status);
              const langBadge = getLangBadge(post);
              return (
                <div key={post.id} style={{ padding: '12px 14px', background: surface, borderRadius: '10px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  
                  {/* CHECKBOX */}
                  <input type="checkbox" checked={selectedPosts.includes(post.id)}
                    onChange={e => {
                      setSelectedPosts(e.target.checked ? [...selectedPosts, post.id] : selectedPosts.filter(id => id !== post.id));
                    }}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }} />

                  {/* POST INFO */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: textPrimary, marginBottom: '2px' }}>
                      {post.title || '(no title)'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.label}
                      </span>
                      <span style={{ fontSize: '11px', color: textSecondary }}>{post.category || '—'}</span>
                      <span style={{ fontSize: '11px', color: textSecondary }}>{langBadge}</span>
                      <span style={{ fontSize: '11px', color: textSecondary }}>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => setQuickEditPost(post)} style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: primary, fontSize: '11px', cursor: 'pointer' }}>
                      Quick Edit
                    </button>
                    <Link href={`/${lang}/admin/posts/${post.id}`} style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: textSecondary, fontSize: '11px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                      <Edit3 size={12} />
                    </Link>
                    <Link href={`/${lang}/blog/${post.slug}`} target="_blank" style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: textSecondary, fontSize: '11px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                      <Eye size={12} />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', color: '#ef4444', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* QUICK EDIT MODAL */}
      {quickEditPost && (
        <QuickEdit post={quickEditPost} lang={lang} onClose={() => setQuickEditPost(null)} onSaved={() => { setQuickEditPost(null); fetchPosts(); }} />
      )}
    </div>
  );
}