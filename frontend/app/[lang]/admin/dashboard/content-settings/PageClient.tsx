"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function PageClient() {
  const { themeColors, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const staticColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  };

  const colors = mounted
    ? {
        background: themeColors?.background || staticColors.background,
        surface: themeColors?.surface || staticColors.surface,
        textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
        textSecondary: themeColors?.text?.secondary || staticColors.textSecondary,
        border: themeColors?.border || staticColors.border,
      }
    : staticColors;

  return (
    <div suppressHydrationWarning className="flex min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="flex-1 p-6 pt-20 lg:pt-6">
        <h1 suppressHydrationWarning className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>Content Settings</h1>
        <div suppressHydrationWarning className="rounded-xl border p-8 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <p suppressHydrationWarning style={{ color: colors.textSecondary }}>This section is ready for data.</p>
        </div>
      </main>
    </div>
  );
}
