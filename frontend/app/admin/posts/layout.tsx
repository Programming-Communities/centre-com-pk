import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminPostsLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background, #f8fafc)' }}>
      <AdminSidebar lang="en" />
      <main style={{ flex: 1, marginLeft: '260px', padding: '30px', transition: 'margin-left 0.3s' }}>
        {children}
      </main>
    </div>
  );
}
