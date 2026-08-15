"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loading bar on navigation
    const loader = document.getElementById("top-loader");
    if (loader) {
      loader.style.width = "0%";
      loader.style.opacity = "1";
      
      // Animate
      setTimeout(() => { loader.style.width = "30%"; }, 50);
      setTimeout(() => { loader.style.width = "60%"; }, 150);
      setTimeout(() => { loader.style.width = "90%"; }, 300);
      setTimeout(() => {
        loader.style.width = "100%";
        setTimeout(() => { loader.style.opacity = "0"; loader.style.width = "0%"; }, 200);
      }, 500);
    }
  }, [pathname, searchParams]);

  return (
    <div id="top-loader" className="fixed top-0 left-0 z-[9999] h-[3px] transition-all duration-300 ease-out"
      style={{ 
        width: "0%", 
        opacity: 0,
        background: "linear-gradient(90deg, var(--primary), #06b6d4, var(--primary))",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
      }} />
  );
}
