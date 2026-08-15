"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { 
  Plus, Trash2, Search, Eye, EyeOff, Edit3, 
  Folder, Save, X, AlertTriangle, Code, Terminal, Package,
  ArrowLeft, FileText
} from "lucide-react";

const CATEGORIES = ["calculators", "code-tools", "design-tools", "image-tools", "pdf-tools", "security-tools", "text-tools"];

export default function ToolsManagerClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  // Editor states
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

  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "14px", backgroundColor: "var(--background)", color: "var(--text-primary)" };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          
          {/* Toast Message */}
          {message && (
            <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-down"
              style={{ backgroundColor: message.includes("✅") ? "var(--success)" : "var(--warning)" }}>
              {message}
            </div>
          )}

          {/* ============ TOOLS LIST VIEW ============ */}
          {!selectedTool && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  🛠️ Tools Manager <span className="text-sm opacity-50">({tools.length})</span>
                </h1>
                <button onClick={() => setShowCreateTool(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)" }}>
                  <Plus size={18} /> New Tool
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..."
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 border rounded-lg text-sm" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: "var(--surface)" }}>
                    <tr>
                      <th className="p-3 text-left">Tool</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tool: any) => (
                      <tr key={tool.id} className="border-t hover:bg-black/5" style={{ borderColor: "var(--border)" }}>
                        <td className="p-3">
                          <button onClick={() => fetchToolFiles(tool)} className="font-medium hover:underline text-left" style={{ color: "var(--primary)" }}>
                            {tool.icon} {tool.slug}
                          </button>
                        </td>
                        <td className="p-3"><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>{tool.category}</span></td>
                        <td className="p-3">
                          <button onClick={() => handleToggleStatus(tool.id, tool.status)} className="flex items-center gap-1 text-xs">
                            {tool.status === "active" ? <span style={{ color: "var(--success)" }}><Eye size={14} className="inline" /> Active</span> : <span style={{ color: "var(--error)" }}><EyeOff size={14} className="inline" /> Inactive</span>}
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Link href={`/${lang}/tools/${tool.category}/${tool.slug}`} target="_blank" className="p-1.5 rounded-lg" style={{ color: "var(--primary)" }}>👁️</Link>
                            <button onClick={() => fetchToolFiles(tool)} className="p-1.5 rounded-lg hover:bg-black/5" style={{ color: "var(--primary)" }} title="Edit Files">
                              <Edit3 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ============ FILE EDITOR VIEW ============ */}
          {selectedTool && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => { setSelectedTool(null); setShowEditor(false); }}
                  className="flex items-center gap-1 text-sm hover:underline" style={{ color: "var(--primary)" }}>
                  <ArrowLeft size={16} /> Back to List
                </button>
                <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  <Terminal size={24} className="inline mr-2" style={{ color: "var(--primary)" }} />
                  {selectedTool.slug}
                </h1>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>({toolFiles.length} files)</span>
                <button onClick={() => setShowCreateFile(true)}
                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
                  style={{ backgroundColor: "var(--success)" }}>
                  <Plus size={16} /> New File
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* File Tree */}
                <div className="lg:col-span-1 rounded-xl border p-4 max-h-[70vh] overflow-y-auto" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <Folder size={18} style={{ color: "var(--primary)" }} /> Files
                  </h3>
                  {toolFiles.map((f: any, i: number) => (
                    <div key={i}>
                      {f.type === "folder" ? (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                            <Folder size={14} /> {f.name}/
                          </div>
                          {f.children?.map((child: any, j: number) => (
                            <div key={j} className="flex items-center justify-between ml-6 py-1.5 px-2 rounded-lg hover:bg-black/5 cursor-pointer group"
                              onClick={() => openFile(f.name + "/" + child.name)}>
                              <div className="flex items-center gap-2 text-xs">
                                <span>{child.icon}</span>
                                <span style={{ color: "var(--text-primary)" }}>{child.name}</span>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(child); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100">
                                <Trash2 size={12} style={{ color: "var(--error)" }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-black/5 cursor-pointer group ml-0"
                          onClick={() => openFile(f.name)}>
                          <div className="flex items-center gap-2 text-xs">
                            <span>{f.icon}</span>
                            <span style={{ color: "var(--text-primary)" }}>{f.name}</span>
                            <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{f.size ? Math.round(f.size/1024) + "KB" : ""}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(f); }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100">
                            <Trash2 size={12} style={{ color: "var(--error)" }} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {toolFiles.length === 0 && (
                    <p className="text-xs text-center py-8" style={{ color: "var(--text-secondary)" }}>No files found</p>
                  )}
                </div>

                {/* Code Editor */}
                <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                  {showEditor && editingFile ? (
                    <>
                      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-2">
                          <Code size={16} style={{ color: "var(--primary)" }} />
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{editingFile.file}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--background)", color: "var(--text-secondary)" }}>{editingFile.ext}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={saveFile} disabled={saving}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium"
                            style={{ backgroundColor: "var(--success)" }}>
                            <Save size={14} /> {saving ? "Saving..." : "Save (Ctrl+S)"}
                          </button>
                          <button onClick={() => { setShowEditor(false); setEditingFile(null); }}
                            className="p-1.5 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <textarea value={fileContent} onChange={e => setFileContent(e.target.value)}
                        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveFile(); } }}
                        className="w-full p-4 font-mono text-sm resize-none focus:outline-none"
                        style={{ minHeight: "500px", backgroundColor: isDarkMode ? "#0d1117" : "#f8f9fa", color: isDarkMode ? "#c9d1d9" : "#24292f", border: "none", lineHeight: 1.6 }}
                        placeholder="// Edit your code here... (Ctrl+S to save)" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64" style={{ color: "var(--text-secondary)" }}>
                      <div className="text-center">
                        <Code size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Select a file from the left panel to edit</p>
                        <p className="text-xs mt-1 opacity-50">Click on any file to open it in the editor</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ============ MODALS ============ */}
          
          {/* Create Tool Modal */}
          {showCreateTool && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateTool(false)}>
              <div className="w-full max-w-md p-6 rounded-xl mx-4" style={{ backgroundColor: "var(--surface)" }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>🆕 Create New Tool</h2>
                  <button onClick={() => setShowCreateTool(false)}><X size={20} /></button>
                </div>
                <div className="space-y-3">
                  <input value={newToolForm.name} onChange={e => setNewToolForm({...newToolForm, name: e.target.value})} placeholder="Tool Display Name" style={inputStyle} />
                  <input value={newToolForm.slug} onChange={e => setNewToolForm({...newToolForm, slug: e.target.value})} placeholder="tool-slug (e.g. my-tool)" style={inputStyle} />
                  <select value={newToolForm.category} onChange={e => setNewToolForm({...newToolForm, category: e.target.value})} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={createTool} className="w-full py-3 text-white rounded-xl font-medium transition hover:opacity-90" style={{ backgroundColor: "var(--primary)" }}>
                    <Package size={16} className="inline mr-2" /> Create Tool with Default Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create File Modal */}
          {showCreateFile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateFile(false)}>
              <div className="w-full max-w-sm p-6 rounded-xl mx-4" style={{ backgroundColor: "var(--surface)" }} onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>📄 Create New File</h2>
                <input value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="e.g. new-component.tsx" style={inputStyle} />
                <p className="text-[10px] mt-1 mb-3" style={{ color: "var(--text-secondary)" }}>Use .tsx, .ts, .css, .json extensions</p>
                <button onClick={createFile} className="w-full py-2.5 text-white rounded-xl font-medium transition hover:opacity-90" style={{ backgroundColor: "var(--success)" }}>
                  <Plus size={14} className="inline mr-1" /> Create File
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(null)}>
              <div className="w-full max-w-sm p-6 rounded-xl mx-4 text-center" style={{ backgroundColor: "var(--surface)" }} onClick={e => e.stopPropagation()}>
                <AlertTriangle size={48} className="mx-auto mb-3" style={{ color: "var(--warning)" }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Delete File?</h3>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>"{showDeleteConfirm.name}"</p>
                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>File will be moved to backup (not permanently deleted)</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>Cancel</button>
                  <button onClick={deleteFile} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: "var(--error)" }}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
