"use client";
import { useRouter } from "next/navigation";
import DashboardEditor from "@/components/dashboard/DashboardEditor";

export default function EditorClient({ lang }: { lang: string }) {
  const router = useRouter();

  const handleSave = async (data: { title: string; content: string; plainText: string }) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    const res = await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", ...data }),
    });
    const result = await res.json();
    if (result.success) router.push("/" + lang + "/dashboard/editor/" + result.id);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 w-full">
        <div className="max-w-5xl mx-auto">
          <DashboardEditor onSave={handleSave} />
        </div>
      </main>
    </div>
  );
}
