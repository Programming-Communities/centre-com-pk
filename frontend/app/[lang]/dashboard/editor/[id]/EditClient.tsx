"use client";
import { useEffect, useState } from "react";
import DashboardEditor from "@/components/dashboard/DashboardEditor";

export default function EditClient({ lang, id }: { lang: string; id: string }) {
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { setLoading(false); return; }
    fetch("/api/dashboard?action=load&id=" + id, { headers: { "Authorization": "Bearer " + token } })
      .then(r => r.json()).then(d => { setDoc(d.document); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: { title: string; content: string; plainText: string }) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", id: parseInt(id), ...data }),
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--primary)" }} /></div>;
  if (!doc) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}><p style={{ color: "var(--text-secondary)" }}>Document not found</p></div>;

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-5xl mx-auto"><DashboardEditor documentId={id} initialTitle={doc.title} initialContent={doc.content || ""} onSave={handleSave} /></div>
    </div>
  );
}
