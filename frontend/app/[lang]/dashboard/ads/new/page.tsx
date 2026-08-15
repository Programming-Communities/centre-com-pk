import { Metadata } from "next";
import CreateAdClient from "./CreateAdClient";

export const metadata: Metadata = {
  title: "Create New Ad - Centre.com.pk",
  description: "Create targeted advertisements with geo-location"
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <CreateAdClient lang={lang} />;
}
