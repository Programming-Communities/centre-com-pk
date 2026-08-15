import { Metadata } from "next";
import PricingClient from "./PricingClient";
export const metadata: Metadata = { title: "Pricing - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <PricingClient lang={lang} />;
}
