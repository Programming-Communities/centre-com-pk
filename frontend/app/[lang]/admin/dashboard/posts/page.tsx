import { Metadata } from "next";
import PostsClient from "./PostsClient";
export const metadata: Metadata = { title: "Posts - Admin" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <PostsClient lang={lang} />;
}
