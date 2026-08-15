"use client";
import { useState, useEffect } from "react";
import ProSidebar from "@/components/dashboard/pro/ProSidebar";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { Users, DollarSign, FileText, TrendingUp, Activity, Package, MessageSquare, Share2, Wrench } from "lucide-react";

export default function OverviewClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";
  const [stats, setStats] = useState<any>({
    totalUsers: 0, activeUsers: 0, totalRevenue: 0,
    totalPosts: 0, totalComments: 0, pendingApprovals: 0,
    totalTools: 53, affiliates: 0
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!mounted) return null;

  const cards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { icon: Activity, label: "Active Today", value: stats.activeUsers, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { icon: DollarSign, label: "Revenue", value: `$${stats.totalRevenue || 0}`, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { icon: FileText, label: "Posts", value: stats.totalPosts, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    { icon: MessageSquare, label: "Comments", value: stats.totalComments, color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
    { icon: Package, label: "Pending", value: stats.pendingApprovals, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    { icon: Wrench, label: "Tools", value: stats.totalTools, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
    { icon: Share2, label: "Affiliates", value: stats.affiliates, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  ];

  const quickLinks = [
    { title: "User Manager", desc: "Manage users, roles, approvals", href: "users", icon: Users, color: "#3b82f6" },
    { title: "Packages & Revenue", desc: "Manage plans, view sales", href: "packages", icon: DollarSign, color: "#f59e0b" },
    { title: "Content Manager", desc: "Posts, comments, settings", href: "posts", icon: FileText, color: "#8b5cf6" },
    { title: "Affiliate System", desc: "Manage affiliates, payouts", href: "affiliates", icon: Share2, color: "#f97316" },
    { title: "Tools Manager", desc: "53 tools, add/edit", href: "/admin/tools-manager", icon: Wrench, color: "#06b6d4" },
    { title: "SEO Manager", desc: "Keywords, rankings", href: "/admin/seo-manager", icon: TrendingUp, color: "#8b5cf6" },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)", direction: isRTL ? "rtl" : "ltr" }}>
      <ProSidebar lang={lang} role="admin" />
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-auto w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Admin Dashboard</h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-28 animate-pulse rounded-xl" style={{ backgroundColor: "var(--surface)" }} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-6">
                {cards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="rounded-xl p-4 lg:p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                      <div className="p-2 rounded-lg inline-block mb-3" style={{ backgroundColor: card.bg }}>
                        <Icon className="w-5 h-5" style={{ color: card.color }} />
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{card.value}</div>
                      <div className="text-xs lg:text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{card.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link, i) => {
                  const Icon = link.icon;
                  const fullHref = link.href.startsWith("/") ? link.href : `/${lang}/admin/dashboard/${link.href}`;
                  return (
                    <a key={i} href={fullHref} className="block p-4 lg:p-5 rounded-xl border hover:shadow-md transition-all"
                      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: link.color + "15" }}>
                          <Icon className="w-5 h-5" style={{ color: link.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{link.title}</h3>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{link.desc}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
