"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children, lang }: { children: React.ReactNode; lang: string }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");
    
    if (!token || !userData) {
      router.push(`/${lang}/auth/signin?redirect=admin`);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role === "admin" || user.role === "super_admin" || user.role === "moderator") {
        setAuthorized(true);
      } else {
        // Non-admin — redirect to CLIENT dashboard
        router.push(`/${lang}/dashboard`);
      }
    } catch {
      router.push(`/${lang}/auth/signin`);
    }
    
    setLoading(false);
  }, [lang, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--primary) var(--primary) var(--primary) transparent" }} />
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
