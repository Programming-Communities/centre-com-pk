'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Search, Edit3, Eye, Trash2 } from 'lucide-react';
import QuickEdit from '@/components/admin/QuickEdit';
import BulkActions from '@/components/admin/BulkActions';

export default function PostsClient() {
  const { lang } = useParams() as { lang: string };
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [quickEditPost, setQuickEditPost] = useState<any>(null);

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
    if (!confirm('Move to trash?')) return;
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

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '23px', fontWeight: 400, color: '#1d2327', margin: 0 }}>Posts</h1>
        <Link href={`/${lang}/admin/posts/new`} style={{
          padding: '8px 16px', backgroundColor: '#2271b1', color: '#fff', borderRadius: '3px',
          textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Plus size={16} /> Add New Post
        </Link>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '4px 8px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '13px' }}>
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={filterLang} onChange={e => setFilterLang(e.target.value)}
          style={{ padding: '4px 8px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '13px' }}>
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="ur">Urdu</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
        </select>
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#8c8f94' }} />
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '4px 8px 4px 28px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '13px', width: '200px' }} />
        </div>
        <span style={{ fontSize: '13px', color: '#50575e' }}>{filteredPosts.length} items</span>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <BulkActions count={selectedPosts.length} onDelete={handleBulkDelete} onClear={() => setSelectedPosts([])} />
      )}

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #c3c4c7' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f1' }}>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', width: '30px', textAlign: 'center' }}>
              <input type="checkbox" onChange={e => {
                setSelectedPosts(e.target.checked ? filteredPosts.map(p => p.id) : []);
              }} />
            </th>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#1d2327' }}>Title</th>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#1d2327' }}>Category</th>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#1d2327' }}>Language</th>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#1d2327' }}>Status</th>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#1d2327' }}>Date</th>
            <th style={{ padding: '8px 10px', borderBottom: '1px solid #c3c4c7', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#1d2327' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
          ) : filteredPosts.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>No posts found.</td></tr>
          ) : (
            filteredPosts.map((post: any) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #c3c4c7' }}>
                <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                  <input type="checkbox" checked={selectedPosts.includes(post.id)}
                    onChange={e => {
                      setSelectedPosts(e.target.checked ? [...selectedPosts, post.id] : selectedPosts.filter(id => id !== post.id));
                    }} />
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d2327' }}>
                    {post.title || '(no title)'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8f94', marginTop: '2px' }}>
                    {post.slug}
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', gap: '4px' }}>
                    <button onClick={() => setQuickEditPost(post)} style={{ fontSize: '11px', color: '#2271b1', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                      Quick Edit
                    </button>
                    <span style={{ color: '#c3c4c7' }}>|</span>
                    <Link href={`/${lang}/blog/${post.slug}`} target="_blank" style={{ fontSize: '11px', color: '#2271b1', textDecoration: 'none' }}>
                      View
                    </Link>
                  </div>
                </td>
                <td style={{ padding: '8px 10px', fontSize: '13px', color: '#50575e' }}>
                  {post.category || '—'}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '13px', color: '#50575e' }}>
                  {(post.available_langs || [post.lang || 'en']).join(', ').toUpperCase()}
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '3px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: post.status === 'published' ? '#d4edda' : '#f8d7da',
                    color: post.status === 'published' ? '#155724' : '#721c24'
                  }}>
                    {post.status || 'draft'}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', fontSize: '13px', color: '#50575e' }}>
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </td>
                <td style={{ padding: '8px 10px', display: 'flex', gap: '6px' }}>
                  <Link href={`/${lang}/admin/posts/${post.id}`} style={{ color: '#2271b1' }} title="Edit">
                    <Edit3 size={16} />
                  </Link>
                  <Link href={`/${lang}/blog/${post.slug}`} target="_blank" style={{ color: '#50575e' }} title="View">
                    <Eye size={16} />
                  </Link>
                  <button onClick={() => handleDelete(post.id)} style={{ color: '#dc3232', border: 'none', background: 'none', cursor: 'pointer' }} title="Trash">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Quick Edit Modal */}
      {quickEditPost && (
        <QuickEdit post={quickEditPost} lang={lang} onClose={() => setQuickEditPost(null)} onSaved={() => { setQuickEditPost(null); fetchPosts(); }} />
      )}
    </div>
  );
}
