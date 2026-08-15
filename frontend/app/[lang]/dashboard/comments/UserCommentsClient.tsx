"use client";
import { MessageSquare } from "lucide-react";

export default function UserCommentsClient({ lang }: { lang: string }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-4xl mx-auto text-center py-20">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "var(--text-secondary)" }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>My Comments</h1>
          <p style={{ color: "var(--text-secondary)" }}>Your comments will appear here</p>
        </div>
      </main>
    </div>
  );
}
