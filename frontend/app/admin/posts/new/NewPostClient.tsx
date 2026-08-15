"use client";
import { useState } from "react";
import ProSidebar from "@/components/dashboard/pro/ProSidebar";
import { Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewPostClient() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "", lang: "en", status: "draft",
    seo_title: "", seo_description: "", seo_keywords: ""
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (publish = false) => {
    setSaving(true);
    const data = { ...form, status: publish ? "published" : "draft" };
    if (!data.slug) data.slug = data.title.toLowerCase().replace(/\s+/g, "-");
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...data }),
    });
    setSaving(false);
    router.push("/admin/dashboard/posts");
  };

  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "14px", marginBottom: "12px", backgroundColor: "var(--background)", color: "var(--text-primary)" };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <ProSidebar lang="en" role="admin" />
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>📝 New Post</h1>
            <div className="flex gap-2">
              <button onClick={() => handleSave(false)} disabled={saving}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                <Save size={16} className="inline mr-1" /> Save Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "var(--primary)" }}>
                <Send size={16} className="inline mr-1" /> Publish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Post title..." style={inputStyle} />
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Write your post content..." rows={15} style={{...inputStyle, minHeight: "300px", resize: "vertical"}} />
              <input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Short excerpt..." style={inputStyle} />
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Settings</h3>
                <label className="text-xs mb-1 block" style={{ color: "var(--text-secondary)" }}>Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="post-slug" style={inputStyle} />
                <label className="text-xs mb-1 block" style={{ color: "var(--text-secondary)" }}>Language</label>
                <select value={form.lang} onChange={e => setForm({...form, lang: e.target.value})} style={inputStyle}>
                  <option value="en">English</option><option value="ur">Urdu</option><option value="hi">Hindi</option><option value="ar">Arabic</option>
                </select>
              </div>
              <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>🔍 SEO</h3>
                <input value={form.seo_title} onChange={e => setForm({...form, seo_title: e.target.value})} placeholder="SEO Title" style={inputStyle} />
                <textarea value={form.seo_description} onChange={e => setForm({...form, seo_description: e.target.value})} placeholder="Meta description" rows={2} style={{...inputStyle, resize: "vertical"}} />
                <input value={form.seo_keywords} onChange={e => setForm({...form, seo_keywords: e.target.value})} placeholder="keyword1, keyword2" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
