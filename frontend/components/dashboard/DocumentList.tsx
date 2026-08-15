"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Search, Clock, Trash2 } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

interface Document {
  id: string;
  title: string;
  updatedAt: string;
  wordCount: number;
  isPublic: boolean;
  folder: string;
}

interface DocumentListProps {
  lang: string;
  content: any;
  apiBase?: string;
}

export default function DocumentList({ lang, content, apiBase = "/api/dashboard" }: DocumentListProps) {
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${apiBase}/list`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(content.editor.confirmDelete)) return;
    try {
      await fetch(`${apiBase}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setDocuments(docs => docs.filter(d => d.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!mounted || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 animate-pulse rounded-xl" style={{ backgroundColor: "var(--surface)" }} />
        ))}
      </div>
    );
  }

  const cardBg = isDarkMode ? "var(--surface)" : "#ffffff";
  const cardBorder = "var(--border)";

  return (
    <div style={{ fontFamily }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{content.title}</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.editor.searchDocuments}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm min-w-[250px] focus:outline-none focus:ring-2"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
          </div>

          <Link href={`/${lang}/dashboard/editor`}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition text-sm font-medium"
            style={{ backgroundColor: "var(--primary)" }}>
            <Plus className="w-4 h-4" />{content.newDocument}
          </Link>
        </div>
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-secondary)", opacity: 0.3 }} />
          <h3 className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>{content.editor.noDocuments}</h3>
          <Link href={`/${lang}/dashboard/editor`}
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 text-white rounded-lg transition"
            style={{ backgroundColor: "var(--primary)" }}>
            <Plus className="w-4 h-4" />{content.newDocument}
          </Link>
        </div>
      )}

      {filteredDocs.length > 0 && (
        <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {filteredDocs.map(doc => (
            <Link key={doc.id} href={`/${lang}/dashboard/editor/${doc.id}`}
              className={`block group border rounded-xl p-4 hover:shadow-md transition ${view === "list" ? "flex items-center justify-between" : ""}`}
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <div className="min-w-0">
                    <h3 className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{doc.title || "Untitled"}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(doc.updatedAt)}</span>
                      <span>{doc.wordCount} words</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 md:mt-0" onClick={e => e.preventDefault()}>
                {doc.isPublic && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--success)", color: "#fff" }}>Public</span>
                )}
                <button onClick={() => handleDelete(doc.id)}
                  className="p-1.5 opacity-0 group-hover:opacity-100 transition" style={{ color: "var(--text-secondary)" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
