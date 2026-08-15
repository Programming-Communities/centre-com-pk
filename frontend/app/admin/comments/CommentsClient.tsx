"use client";
import { useState, useEffect } from "react";
import ProSidebar from "@/components/dashboard/pro/ProSidebar";

export default function CommentsClient() {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/comments?action=list").then(r => r.json()).then(d => setComments(d.comments || []));
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <ProSidebar lang="en" role="admin" />
      <main className="flex-1 p-6 pt-16 lg:pt-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Comments</h1>
        {comments.map((c: any) => (
          <div key={c.id} className="p-4 rounded-xl border mb-2" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <p style={{ color: "var(--text-primary)" }}>{c.content}</p>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{c.status}</span>
          </div>
        ))}
      </main>
    </div>
  );
}
