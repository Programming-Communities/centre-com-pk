"use client";
import { ArrowLeft, Bookmark } from "lucide-react";
import Link from "next/link";

export default function BookmarksClient({ lang }: { lang: string }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-6 pt-16 lg:pt-6 w-full">
        <Link href={"/" + lang + "/dashboard"} className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Bookmarks</h1>
        <div className="text-center py-20">
          <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "var(--text-secondary)" }} />
          <p style={{ color: "var(--text-secondary)" }}>No bookmarks yet</p>
        </div>
      </main>
    </div>
  );
}
