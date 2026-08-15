import { Metadata } from "next";
import ToolsManagerClient from "./ToolsManagerClient";

export const metadata: Metadata = { title: "Tools Manager - Admin" };

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <ToolsManagerClient lang={lang} />;
}
