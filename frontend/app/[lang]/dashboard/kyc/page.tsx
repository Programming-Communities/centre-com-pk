import { Metadata } from "next";
import KYCClient from "./KYCClient";
export const metadata: Metadata = { title: "KYC Verification - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <KYCClient lang={lang} />;
}
