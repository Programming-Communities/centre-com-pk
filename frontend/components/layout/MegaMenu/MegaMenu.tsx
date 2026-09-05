'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ChevronDown, Image, FileText, Calculator, Code, Type, Palette, Shield, 
  ArrowRight, X, Search
} from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

interface MegaMenuProps {
  mobile?: boolean;
  onItemClick?: () => void;
  category?: "all" | "imageTools" | "pdfTools" | "calculators" | "codeTools" | "textTools" | "designTools" | "securityTools";
  lang: string;
}

interface Tool {
  name: string;
  href: string;
  status: "live" | "soon" | "new" | "popular";
  description: string;
  category: string;
}

const staticMenuData: Record<string, any> = {
  all: {
    title: "All Tools",
    description: "50+ professional tools",
    icon: null,
    href: "/tools",
    tools: [
      { name: "Age Calculator", href: "/tools/calculators/age-calculator", status: "popular", description: "Calculate exact age", category: "calculators" },
      { name: "BMI Calculator", href: "/tools/calculators/bmi-calculator", status: "popular", description: "Body Mass Index", category: "calculators" },
      { name: "PDF Merger", href: "/tools/pdf-tools/pdf-merger", status: "popular", description: "Merge PDF files", category: "pdf-tools" },
      { name: "Password Generator", href: "/tools/security-tools/password-generator", status: "popular", description: "Secure passwords", category: "security-tools" },
      { name: "QR Code Generator", href: "/tools/code-tools/qr-code-generator", status: "popular", description: "Create QR codes", category: "code-tools" },
      { name: "Image Compressor", href: "/tools/image-tools/image-compressor", status: "live", description: "Compress images", category: "image-tools" },
    ],
  },
};

export default function MegaMenu({ mobile = false, onItemClick, category = "all", lang }: MegaMenuProps) {
  const { themeColors } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ✅ FIXED: isMobileView ko useEffect se set karo (hydration fix)
  useEffect(() => {
    const checkSize = () => setIsMobileView(window.innerWidth < 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
    setActiveMenu(null);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  }, [isVisible]);

  const menuData = staticMenuData[category] || staticMenuData.all;
  const allTools = menuData.tools || [];

  // ✅ HYDROGEN FIX: Don't render until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ color: themeColors?.text?.primary || "#0f172a", backgroundColor: themeColors?.surface || "#f8fafc" }}
      >
        <span>{isMobileView ? "Tools" : "Tools"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isVisible ? "rotate-180" : ""}`} />
      </button>

      {isVisible && (
        <div
          className="fixed left-1/2 transform -translate-x-1/2 z-50 mt-2"
          style={{
            width: isMobileView ? "calc(100vw - 2rem)" : "600px",
            maxHeight: "80vh",
            backgroundColor: themeColors?.background || "#ffffff",
            border: `1px solid ${themeColors?.border || "#e2e8f0"}`,
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          <div className="p-3">
            {/* SEARCH */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: themeColors?.text?.secondary || "#64748b" }} />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: themeColors?.surface || "#f8fafc",
                  color: themeColors?.text?.primary || "#0f172a",
                  border: `1px solid ${themeColors?.border || "#e2e8f0"}`,
                }}
              />
            </div>

            {/* TOOLS GRID */}
            <div className={`grid ${isMobileView ? 'grid-cols-2' : 'grid-cols-3'} gap-2 max-h-[50vh] overflow-y-auto`}>
              {allTools
                .filter((tool: Tool) => 
                  !searchQuery || 
                  tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tool.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((tool: Tool) => (
                  <Link
                    key={tool.name}
                    href={`/${lang}${tool.href}`}
                    onClick={() => { closeMenu(); onItemClick?.(); }}
                    className="p-3 rounded-lg border transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: themeColors?.surface || "#f8fafc",
                      borderColor: themeColors?.border || "#e2e8f0",
                      textDecoration: 'none',
                    }}
                  >
                    <div className="text-sm font-semibold truncate" style={{ color: themeColors?.text?.primary || "#0f172a" }}>
                      {tool.name}
                    </div>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: themeColors?.text?.secondary || "#64748b" }}>
                      {tool.description}
                    </p>
                  </Link>
                ))}
            </div>

            {/* VIEW ALL */}
            <Link
              href={`/${lang}/tools`}
              onClick={() => { closeMenu(); onItemClick?.(); }}
              className="block text-center text-sm font-medium mt-3 py-2 rounded-lg"
              style={{ backgroundColor: `${themeColors?.primary || "#3b82f6"}15`, color: themeColors?.primary || "#3b82f6", textDecoration: 'none' }}
            >
              View All 50+ Tools →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
