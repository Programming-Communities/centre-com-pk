import { Metadata } from "next";
import PlanClient from "./PlanClient";
export const metadata: Metadata = { title: "My Plan - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <PlanClient lang={lang} />;
}
