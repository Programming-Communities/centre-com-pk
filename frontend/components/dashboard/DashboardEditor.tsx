"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useEffect, useMemo } from "react";
import { Save, Download, Share2, Maximize2, Minimize2, Trash2 } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-96 animate-pulse rounded-lg flex items-center justify-center" 
         style={{ backgroundColor: "var(--surface)" }}>
      <span style={{ color: "var(--text-secondary)" }}>Loading editor...</span>
    </div>
  ),
});



interface DashboardEditorProps {
  documentId?: string;
  initialTitle?: string;
  initialContent?: string;
  onSave?: (data: { title: string; content: string; plainText: string }) => void;
  readOnly?: boolean;
}

export default function DashboardEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  readOnly = false,
}: DashboardEditorProps) {
  const { themeColors, isDarkMode, fontFamily, lang } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";
  
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["code-block"],
      ["clean"],
    ],
  }), []);

  const formats = useMemo(() => [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent", "align", "color", "background",
    "link", "image", "video", "code-block",
  ], []);

  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "");
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, title]);

  const handleChange = useCallback((value: string) => setContent(value), []);
  
  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      const plainText = content.replace(/<[^>]*>/g, "");
      onSave({ title, content, plainText });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<html dir="${isRTL ? "rtl" : "ltr"}"><head><title>${title || "Document"}</title><style>body{font-family:${fontFamily};padding:40px;max-width:800px;margin:auto}img{max-width:100%}</style></head><body><h1>${title}</h1>${content}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportHTML = () => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title || "document") + ".html";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  const surfaceBg = isDarkMode ? "rgba(55,65,81,0.5)" : "rgba(249,250,251,0.8)";
  const buttonHover = isDarkMode ? "rgba(55,65,81,0.8)" : "rgba(243,244,246,0.8)";

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 p-4" : ""} 
         style={{ backgroundColor: "var(--background)", fontFamily }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-lg"
           style={{ backgroundColor: surfaceBg, direction: isRTL ? "rtl" : "ltr" }}>
        <div className="flex items-center gap-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Document" readOnly={readOnly}
            className="text-xl font-bold bg-transparent border-none outline-none min-w-[200px]"
            style={{ color: "var(--text-primary)" }} />
          {lastSaved && <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Saved {lastSaved.toLocaleTimeString()}</span>}
          {isSaving && <span className="text-xs animate-pulse" style={{ color: "var(--primary)" }}>Saving...</span>}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: buttonHover, color: "var(--text-secondary)" }}>
            {wordCount} words | {charCount} chars
          </span>
          {!readOnly && (
            <>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 text-white text-sm rounded-lg disabled:opacity-50 transition"
                style={{ backgroundColor: "var(--primary)" }}>
                <Save className="w-4 h-4" />Save
              </button>
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 text-white text-sm rounded-lg transition"
                  style={{ backgroundColor: "var(--success)" }}>
                  <Download className="w-4 h-4" />Export
                </button>
                <div className="absolute right-0 top-full mt-1 shadow-xl rounded-lg py-2 min-w-[180px] hidden group-hover:block z-10"
                     style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                  <button onClick={handleExportPDF} className="block w-full text-left px-4 py-2 text-sm hover:opacity-80" style={{ color: "var(--text-primary)" }}>PDF</button>
                  <button onClick={handleExportHTML} className="block w-full text-left px-4 py-2 text-sm hover:opacity-80" style={{ color: "var(--text-primary)" }}>HTML</button>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-white text-sm rounded-lg transition"
                style={{ backgroundColor: "var(--secondary)" }}>
                <Share2 className="w-4 h-4" />Share
              </button>
            </>
          )}
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 transition"
            style={{ color: "var(--text-secondary)" }}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {!readOnly && (
            <button className="p-1.5 transition" style={{ color: "var(--error)" }}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className={`border rounded-lg overflow-hidden ${isFullscreen ? "h-[calc(100vh-120px)]" : ""}`}
           style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <ReactQuill theme="snow" value={content} onChange={handleChange}
          modules={modules} formats={formats} readOnly={readOnly}
          placeholder="Start writing your document... (Ctrl+S to save)" />
      </div>
    </div>
  );
}
