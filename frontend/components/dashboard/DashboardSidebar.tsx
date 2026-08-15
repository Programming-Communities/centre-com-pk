"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Clock, Star, Folder, Plus, Trash2, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function DashboardSidebar({ lang, content }: any) {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    location.href = "/" + lang + "/auth/signin";
  };

  const items = [
    { icon: FileText, label: content?.sidebar?.allDocuments || "All Documents", href: "/" + lang + "/dashboard" },
    { icon: Clock, label: content?.sidebar?.recentDocuments || "Recent", href: "/" + lang + "/dashboard?filter=recent" },
    { icon: Star, label: content?.sidebar?.starredDocuments || "Starred", href: "/" + lang + "/dashboard?filter=starred" },
    { icon: Trash2, label: content?.trash || "Trash", href: "/" + lang + "/dashboard?filter=trash" },
  ];

  return (
    <aside className="w-64 border-r flex flex-col min-h-screen" 
           style={{ backgroundColor: isDarkMode ? "var(--surface)" : "#fff", borderColor: "var(--border)", direction: isRTL ? "rtl" : "ltr" }}>
      <div className="p-4">
        <Link href={"/" + lang + "/dashboard/editor"}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white rounded-lg font-medium"
          style={{ backgroundColor: "var(--primary)" }}>
          <Plus className="w-5 h-5" />New Document
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {items.map((item, i) => (
          <Link key={i} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
            style={{ 
              color: pathname === item.href ? "var(--primary)" : "var(--text-secondary)",
              backgroundColor: pathname === item.href ? (isDarkMode ? "rgba(59,130,246,0.2)" : "rgba(29,78,216,0.08)") : "transparent"
            }}>
            <item.icon className="w-4 h-4" />{item.label}
          </Link>
        ))}
      </nav>
      
      {/* LOGOUT BUTTON */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition hover:opacity-80"
          style={{ color: "var(--error)" }}>
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </aside>
  );
}
