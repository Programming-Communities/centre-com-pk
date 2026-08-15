"use client";
import AdminGuard from "@/components/dashboard/pro/AdminGuard";
import OverviewClient from "./OverviewClient";

export default function AdminDashboardClient({ lang }: { lang: string }) {
  return (
    <AdminGuard lang={lang}>
      <OverviewClient lang={lang} />
    </AdminGuard>
  );
}
