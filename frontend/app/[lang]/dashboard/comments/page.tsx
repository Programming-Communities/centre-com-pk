import { Metadata } from "next";
import UserCommentsClient from "./UserCommentsClient";
export const metadata: Metadata = { title: "My Comments - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <UserCommentsClient lang={lang} />;
}
