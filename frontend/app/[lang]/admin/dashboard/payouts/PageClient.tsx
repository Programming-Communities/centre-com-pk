"use client";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function PageClient() {
  const { themeColors, isDarkMode } = useTheme();
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-6 pt-20 lg:pt-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Payouts</h1>
        <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p style={{ color: "var(--text-secondary)" }}>This section is ready for data.</p>
        </div>
      </main>
    </div>
  );
}
