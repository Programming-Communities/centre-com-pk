"use client";
import { DollarSign, Download } from "lucide-react";

export default function SalesClient() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-6 pt-16 lg:pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>💵 Sales & Transactions</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: "var(--primary)" }}><Download className="w-4 h-4" /> Export CSV</button>
        </div>
        <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "var(--text-secondary)" }} />
          <p style={{ color: "var(--text-secondary)" }}>Sales data will appear here after payments are processed</p>
        </div>
      </main>
    </div>
  );
}
