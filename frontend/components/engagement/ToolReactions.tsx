"use client";
import { useState, useEffect } from "react";
import { ThumbsUp, Heart, Star, Laugh } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

const REACTIONS = [
  { type: "like", icon: ThumbsUp, label: "Like", color: "#3b82f6" },
  { type: "love", icon: Heart, label: "Love", color: "#ec4899" },
  { type: "wow", icon: Star, label: "Wow", color: "#f59e0b" },
  { type: "funny", icon: Laugh, label: "Funny", color: "#10b981" },
];

export default function ToolReactions({ toolSlug }: { toolSlug: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); fetchCounts(); }, [toolSlug]);

  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/tools/reactions?tool=" + toolSlug);
      if (res.ok) setCounts((await res.json()).counts || {});
    } catch (e) { console.error(e); }
  };

  const handleReact = async (type: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tools/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: toolSlug, reaction: type }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || {});
        setActive(active === type ? null : type);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!mounted) return null;
  const total = Object.values(counts).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="reactions-container" style={{ 
      padding: "16px 0", 
      marginTop: "24px",
      borderTop: "2px solid var(--border)",
      borderBottom: "2px solid var(--border)"
    }}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {total > 0 ? `👍 ${total} reactions` : "💬 Be the first to react!"}
        </span>
        <div className="flex flex-wrap gap-2">
          {REACTIONS.map(r => {
            const Icon = r.icon;
            const isActive = active === r.type;
            const count = counts[r.type] || 0;
            return (
              <button key={r.type} onClick={() => handleReact(r.type)} disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-sm"
                style={{
                  backgroundColor: isActive ? r.color + "25" : isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                  border: `2px solid ${isActive ? r.color : "var(--border)"}`,
                  color: isActive ? r.color : "var(--text-secondary)",
                  cursor: "pointer",
                  minWidth: count > 0 ? "auto" : "48px",
                  justifyContent: "center"
                }}>
                <Icon className="w-4 h-4" style={{ color: isActive ? r.color : undefined }} />
                {count > 0 && <span className="font-bold">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
