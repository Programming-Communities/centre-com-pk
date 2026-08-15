"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function CommentsClient({ lang }: { lang: string }) {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/comments?action=list").then(r => r.json()).then(d => setComments(d.comments || []));
  }, []);

  const handleAction = async (id: number, status: string) => {
    await fetch("/api/admin/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", id, status }) });
    setComments(c => c.map(x => x.id === id ? {...x, status} : x));
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>💬 Comment Manager</h1>
          <div className="space-y-3">
            {comments.map((c: any) => (
              <div key={c.id} className="flex items-start justify-between p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{c.user_name || "Anonymous"}</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{c.content}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full mt-2 inline-block" style={{ color: c.status === "approved" ? "var(--success)" : "var(--warning)" }}>{c.status}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(c.id, "approved")} style={{ color: "var(--success)" }}><CheckCircle className="w-5 h-5" /></button>
                  <button onClick={() => handleAction(c.id, "spam")} style={{ color: "var(--error)" }}><XCircle className="w-5 h-5" /></button>
                  <button onClick={() => handleAction(c.id, "trash")} style={{ color: "var(--text-secondary)" }}><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
