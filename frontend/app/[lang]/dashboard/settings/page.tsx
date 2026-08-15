import { Metadata } from "next";
import SettingsClient from "./SettingsClient";
export const metadata: Metadata = { title: "Settings - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <SettingsClient lang={lang} />;
}
