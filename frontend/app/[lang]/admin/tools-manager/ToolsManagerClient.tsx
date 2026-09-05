"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { 
  Plus, Trash2, Search, Eye, EyeOff, Edit3, 
  Folder, Save, X, AlertTriangle, Code, Terminal, Package,
  ArrowLeft
} from "lucide-react";

const CATEGORIES = ["calculators", "code-tools", "design-tools", "image-tools", "pdf-tools", "security-tools", "text-tools"];

export default function ToolsManagerClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [toolFiles, setToolFiles] = useState<any[]>([]);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [fileContent, setFileContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateTool, setShowCreateTool] = useState(false);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newToolForm, setNewToolForm] = useState({ slug: "", category: "calculators", name: "" });
  const [newFileName, setNewFileName] = useState("");

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  useEffect(() => { fetchTools(); }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch("/api/admin/tools");
      const data = await res.json();
      setTools(data.tools || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchToolFiles = async (tool: any) => {
    setSelectedTool(tool);
    setShowEditor(false);
    setEditingFile(null);
    try {
      const res = await fetch(`/api/admin/tools/files?action=list&tool=${tool.slug}`);
      const data = await res.json();
      setToolFiles(data.files || []);
    } catch (e) { console.error(e); }
  };

  const openFile = async (filePath: string) => {
    try {
      const res = await fetch(`/api/admin/tools/files?action=read&tool=${selectedTool.slug}&file=${filePath}`);
      const data = await res.json();
      if (data.error) { setMessage(data.error); setTimeout(() => setMessage(""), 3000); return; }
      setEditingFile(data);
      setFileContent(data.content);
      setShowEditor(true);
    } catch (e) { console.error(e); }
  };

  const saveFile = async () => {
    if (!selectedTool || !editingFile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tools/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", tool: selectedTool.slug, file: editingFile.file, content: fileContent }),
      });
      const data = await res.json();
      setMessage(data.message || "✅ Saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const createFile = async () => {
    if (!selectedTool || !newFileName) return;
    try {
      const res = await fetch("/api/admin/tools/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-file", tool: selectedTool.slug, filename: newFileName, content: "// New file" }),
      });
      const data = await res.json();
      setMessage(data.message || "✅ File created!");
      setShowCreateFile(false);
      setNewFileName("");
      fetchToolFiles(selectedTool);
    } catch (e) { console.error(e); }
  };

  const deleteFile = async () => {
    if (!showDeleteConfirm) return;
    try {
      await fetch("/api/admin/tools/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-file", tool: selectedTool.slug, file: showDeleteConfirm.path }),
      });
      setMessage("🗑️ File moved to backup");
      setShowDeleteConfirm(null);
      fetchToolFiles(selectedTool);
    } catch (e) { console.error(e); }
  };

  const createTool = async () => {
    try {
      const res = await fetch("/api/admin/tools/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-tool", newTool: newToolForm }),
      });
      const data = await res.json();
      setMessage(data.message || "✅ Tool created!");
      setShowCreateTool(false);
      setNewToolForm({ slug: "", category: "calculators", name: "" });
      fetchTools();
    } catch (e) { console.error(e); }
  };

  const handleToggleStatus = async (id: number, status: string) => {
    await fetch("/api/admin/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "toggle", id, status: status === "active" ? "inactive" : "active" }) });
    fetchTools();
  };

  const filtered = tools.filter((t: any) => {
    const m = (t.slug || "").toLowerCase().includes(search.toLowerCase());
    const c = filterCategory === "all" || t.category === filterCategory;
    return m && c;
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${border}`,
    borderRadius: '8px',
    fontSize: '13px',
    backgroundColor: surface,
    color: textPrimary,
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 0' }}>
      
      {/* TOAST */}
      {message && (
        <div style={{ position: 'fixed', top: '70px', right: '16px', zIndex: 1000, padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', backgroundColor: message.includes('✅') ? '#10b981' : '#f59e0b' }}>
          {message}
        </div>
      )}

      {/* TOOLS LIST VIEW */}
      {!selectedTool && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h1 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: textPrimary, margin: 0 }}>
              🛠️ Tools Manager <span style={{ fontSize: '13px', color: textSecondary }}>({tools.length})</span>
            </h1>
            <button onClick={() => setShowCreateTool(true)}
              style={{ padding: '8px 16px', background: primary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} /> New Tool
            </button>
          </div>

          {/* SEARCH + FILTER */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..." 
                style={{ ...inputStyle, paddingLeft: '34px' }} />
            </div>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* TOOLS TABLE → CARDS ON MOBILE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.map((tool: any) => (
              <div key={tool.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: surface, borderRadius: '10px', border: `1px solid ${border}`, flexWrap: 'wrap', gap: '8px' }}>
                <button onClick={() => fetchToolFiles(tool)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: primary, fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
                  {tool.icon} {tool.slug}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: textSecondary, padding: '2px 8px', borderRadius: '10px', background: surface, border: `1px solid ${border}` }}>{tool.category}</span>
                  <button onClick={() => handleToggleStatus(tool.id, tool.status)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: tool.status === 'active' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {tool.status === 'active' ? <Eye size={12} /> : <EyeOff size={12} />} {tool.status}
                  </button>
                  <button onClick={() => fetchToolFiles(tool)} style={{ padding: '5px 10px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', color: primary, fontSize: '11px' }}>
                    <Edit3 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FILE EDITOR VIEW */}
      {selectedTool && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => { setSelectedTool(null); setShowEditor(false); }} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', color: primary, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={13} /> Back
            </button>
            <h1 style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 700, color: textPrimary, margin: 0 }}>
              <Terminal size={18} style={{ marginRight: '6px', verticalAlign: 'middle', color: primary }} />
              {selectedTool.slug}
            </h1>
            <button onClick={() => setShowCreateFile(true)} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={13} /> New File
            </button>
          </div>

          {/* MOBILE: Stack vertically | DESKTOP: Side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {/* FILE TREE */}
            <div style={{ padding: '12px', background: surface, borderRadius: '10px', border: `1px solid ${border}`, maxHeight: '300px', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, margin: '0 0 8px' }}>📁 Files ({toolFiles.length})</h3>
              {toolFiles.map((f: any, i: number) => (
                <div key={i}>
                  {f.type === "folder" ? (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, padding: '4px 6px' }}>📁 {f.name}/</div>
                      {f.children?.map((child: any, j: number) => (
                        <div key={j} onClick={() => openFile(f.name + "/" + child.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 6px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: textPrimary }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${primary}08`}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <span>{child.icon} {child.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(child); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '11px' }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div onClick={() => openFile(f.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: textPrimary }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${primary}08`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <span>{f.icon} {f.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(f); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '11px' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CODE EDITOR */}
            <div style={{ background: surface, borderRadius: '10px', border: `1px solid ${border}`, overflow: 'hidden' }}>
              {showEditor && editingFile ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{editingFile.file}</span>
                    <button onClick={saveFile} disabled={saving} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                      {saving ? 'Saving...' : '💾 Save'}
                    </button>
                  </div>
                  <textarea value={fileContent} onChange={e => setFileContent(e.target.value)} 
                    style={{ width: '100%', minHeight: '300px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', backgroundColor: isDarkMode ? '#0d1117' : '#f8f9fa', color: isDarkMode ? '#c9d1d9' : '#24292f', border: 'none', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    placeholder="// Edit your code here..." />
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: textSecondary }}>
                  <Code size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', margin: 0 }}>Select a file to edit</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* CREATE TOOL MODAL */}
      {showCreateTool && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowCreateTool(false)}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '20px', background: surface, borderRadius: '12px', border: `1px solid ${border}` }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: '0 0 14px' }}>🆕 Create New Tool</h2>
            <input value={newToolForm.name} onChange={e => setNewToolForm({...newToolForm, name: e.target.value})} placeholder="Tool Display Name" style={{ ...inputStyle, marginBottom: '10px' }} />
            <input value={newToolForm.slug} onChange={e => setNewToolForm({...newToolForm, slug: e.target.value})} placeholder="tool-slug (e.g. my-tool)" style={{ ...inputStyle, marginBottom: '10px' }} />
            <select value={newToolForm.category} onChange={e => setNewToolForm({...newToolForm, category: e.target.value})} style={{ ...inputStyle, marginBottom: '14px' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={createTool} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: primary, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Create Tool
            </button>
          </div>
        </div>
      )}

      {/* CREATE FILE MODAL */}
      {showCreateFile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowCreateFile(false)}>
          <div style={{ width: '100%', maxWidth: '340px', padding: '20px', background: surface, borderRadius: '12px', border: `1px solid ${border}` }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: '0 0 14px' }}>📄 New File</h2>
            <input value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="e.g. new-component.tsx" style={{ ...inputStyle, marginBottom: '14px' }} />
            <button onClick={createFile} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Create File
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowDeleteConfirm(null)}>
          <div style={{ width: '100%', maxWidth: '320px', padding: '20px', background: surface, borderRadius: '12px', border: `1px solid ${border}`, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertTriangle size={32} style={{ color: '#f59e0b', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: '0 0 6px' }}>Delete File?</h3>
            <p style={{ fontSize: '12px', color: textSecondary, margin: '0 0 14px' }}>File will be moved to backup</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={deleteFile} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
