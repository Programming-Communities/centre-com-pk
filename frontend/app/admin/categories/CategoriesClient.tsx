'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Plus, Edit3, Trash2, Search, FolderOpen, Tag, Wrench, FileText } from 'lucide-react';

export default function CategoriesClient() {
  const { themeColors, isDarkMode } = useTheme();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', type: 'blog', icon: '', description: '', lang: 'en', parent_id: '' });

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/admin/categories';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...form } : form;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setEditingId(null);
    setForm({ name: '', slug: '', type: 'blog', icon: '', description: '', lang: 'en', parent_id: '' });
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, slug: cat.slug, type: cat.type || 'blog', icon: cat.icon || '', description: cat.description || '', lang: cat.lang || 'en', parent_id: cat.parent_id || '' });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const typeIcons: Record<string, any> = { blog: FileText, tool: Wrench, tag: Tag };
  const typeColors: Record<string, string> = { blog: '#3b82f6', tool: '#10b981', tag: '#f59e0b' };

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px', borderRadius: '8px', border: `1px solid ${border}`,
    backgroundColor: 'transparent', color: textPrimary, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, margin: '0 0 6px' }}>
            <FolderOpen size={28} style={{ marginRight: '8px', verticalAlign: 'middle', color: primary }} />
            Categories Manager
          </h1>
          <p style={{ fontSize: '14px', color: textSecondary, margin: 0 }}>Manage blog categories, tool categories, and tags</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', slug: '', type: 'blog', icon: '', description: '', lang: 'en', parent_id: '' }); }}
          style={{ padding: '12px 24px', background: primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ padding: '24px', backgroundColor: surface, borderRadius: '16px', border: `1px solid ${border}`, marginBottom: '28px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          <input required placeholder="Category Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input required placeholder="Slug (auto-generated)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} style={inputStyle} />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inputStyle}>
            <option value="blog">📝 Blog Category</option>
            <option value="tool">🔧 Tool Category</option>
            <option value="tag">🏷️ Tag</option>
          </select>
          <select value={form.lang} onChange={e => setForm({...form, lang: e.target.value})} style={inputStyle}>
            <option value="en">English (en)</option>
            <option value="ur">Urdu (ur)</option>
            <option value="hi">Hindi (hi)</option>
            <option value="ar">Arabic (ar)</option>
          </select>
          <input placeholder="Icon (emoji)" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={inputStyle} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...inputStyle, gridColumn: 'span 2'}} />
          <button type="submit" style={{ gridColumn: 'span 2', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}>
            {editingId ? '✅ Update Category' : '➕ Create Category'}
          </button>
        </form>
      )}

      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
        <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: surface, color: textPrimary, fontSize: '14px' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>Loading categories...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.filter((c: any) => c.name?.toLowerCase().includes(search.toLowerCase())).map((cat: any) => {
            const TypeIcon = typeIcons[cat.type] || Tag;
            const typeColor = typeColors[cat.type] || '#64748b';
            return (
              <div key={cat.id} style={{ padding: '16px', background: surface, borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${typeColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {cat.icon || <TypeIcon size={20} color={typeColor} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: textPrimary, fontSize: '15px' }}>{cat.name} <span style={{ fontSize: '11px', color: typeColor, background: `${typeColor}15`, padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>{cat.type}</span></div>
                    <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>/{cat.slug} • {cat.lang} • {cat.post_count || 0} posts</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleEdit(cat)} style={{ padding: '8px 14px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', color: textSecondary, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', cursor: 'pointer', color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: textSecondary }}>
              <FolderOpen size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px' }}>No categories yet. Create your first category!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
