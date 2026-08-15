'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Eye, Send, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    relatedTools: '',
    status: 'draft',
    lang: 'en',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    visibility: 'public',
  });

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/posts?id=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          featuredImage: data.featuredImage || '',
          categoryId: String(data.categoryId || ''),
          relatedTools: data.relatedTools || '',
          status: data.status || 'draft',
          lang: data.lang || 'en',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: data.seoKeywords || '',
          visibility: data.visibility || 'public',
        });
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/admin/posts?id=${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: publish ? 'published' : form.status }),
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts?id=${postId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/posts');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Edit Post</h1>
            <p className="text-text-secondary mt-1">Post ID: {postId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Delete
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg font-semibold"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="post-url-slug"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Content</label>
              <RichTextEditor
                value={form.content}
                onChange={(content: string) => setForm(prev => ({ ...prev, content }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the post..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-text-primary">Post Settings</h3>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Visibility</label>
                <select
                  value={form.visibility}
                  onChange={(e) => setForm(prev => ({ ...prev, visibility: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Language</label>
                <select
                  value={form.lang}
                  onChange={(e) => setForm(prev => ({ ...prev, lang: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                  <option value="hi">Hindi</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="1">Calculators</option>
                  <option value="2">Code Tools</option>
                  <option value="3">Image Tools</option>
                  <option value="4">PDF Tools</option>
                  <option value="5">Security Tools</option>
                  <option value="6">Text Tools</option>
                  <option value="7">Design Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Related Tools</label>
                <input
                  type="text"
                  value={form.relatedTools}
                  onChange={(e) => setForm(prev => ({ ...prev, relatedTools: e.target.value }))}
                  placeholder="age-calculator, bmi-calculator"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={form.featuredImage}
                  onChange={(e) => setForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-text-primary">SEO Settings</h3>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="Custom SEO title..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">SEO Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Meta description..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">SEO Keywords</label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => setForm(prev => ({ ...prev, seoKeywords: e.target.value }))}
                  placeholder="keyword1, keyword2, ..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
