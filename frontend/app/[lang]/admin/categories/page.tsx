'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Plus, Trash2, Edit3, FolderOpen } from 'lucide-react';

export default function CategoriesPage() {
  const { themeColors } = useTheme();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    console.log('API Response:', data);
    // Handle all possible response formats
    const list = Array.isArray(data) ? data : data.categories || data.data || data.rows || [];
    setCategories(list);
    setLoading(false);
  };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCat, slug: newCat.toLowerCase().replace(/\s+/g, '-') }),
    });
    setNewCat('');
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const updateCategory = async (id: string) => {
    await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName }),
    });
    setEditingId(null);
    fetchCategories();
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: textSecondary }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FolderOpen size={24} /> Categories ({categories.length})
      </h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input type="text" placeholder="New category" value={newCat} onChange={e => setNewCat(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: surface, color: textPrimary }} />
        <button onClick={addCategory} style={{ padding: '10px 20px', background: primary, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add
        </button>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>No categories yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map((cat: any) => (
            <div key={cat.id || cat.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: surface, borderRadius: '8px', border: `1px solid ${border}` }}>
              {editingId === (cat.id || cat.slug) ? (
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: `1px solid ${border}`, color: textPrimary }} />
                  <button onClick={() => updateCategory(cat.id)} style={{ padding: '6px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', color: textSecondary }}>Cancel</button>
                </div>
              ) : (
                <>
                  <span style={{ fontWeight: 500, color: textPrimary }}>{cat.name || cat.title || cat.slug}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => { setEditingId(cat.id || cat.slug); setEditName(cat.name || cat.title || ''); }} style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', color: textSecondary }}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => deleteCategory(cat.id || cat.slug)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
