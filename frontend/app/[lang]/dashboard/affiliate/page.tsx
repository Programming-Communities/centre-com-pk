import { Metadata } from "next";
import UserAffiliateClient from "./UserAffiliateClient";
export const metadata: Metadata = { title: "Affiliate - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <UserAffiliateClient lang={lang} />;
}
