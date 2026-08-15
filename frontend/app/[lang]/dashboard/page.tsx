import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = { title: "Dashboard - Centre.com.pk" };

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <DashboardClient lang={lang} />;
}
