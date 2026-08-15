import { Metadata } from "next";
import Link from "next/link";
import ClientAds from "./ClientAds";

export const metadata: Metadata = {
  title: "My Ads - Centre.com.pk",
  description: "Manage your advertisements"
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ClientAds lang={lang} />;
}
