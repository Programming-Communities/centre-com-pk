import { Metadata } from "next";
import SEOClient from "./SEOClient";
export const metadata: Metadata = { title: "SEO Manager - Admin" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <SEOClient lang={lang} />;
}
