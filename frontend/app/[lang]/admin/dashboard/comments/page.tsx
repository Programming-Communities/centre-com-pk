import { Metadata } from "next";
import CommentsClient from "./CommentsClient";
export const metadata: Metadata = { title: "Comments - Admin" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <CommentsClient lang={lang} />;
}
