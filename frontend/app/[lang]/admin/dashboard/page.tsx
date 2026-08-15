import { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = { title: "Admin Dashboard - Centre.com.pk" };

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <AdminDashboardClient lang={lang} />;
}
