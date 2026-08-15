"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function PageLoader() {
  const { themeColors, isDarkMode } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-300"
      style={{ backgroundColor: "var(--background)" }}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${themeColors?.primary || "#3b82f6"} transparent ${themeColors?.primary || "#3b82f6"} transparent` }} />
        </div>
        {/* Text */}
        <p className="text-sm font-medium animate-pulse" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
