import { Metadata } from "next";
import MyPostsClient from "./MyPostsClient";

export const metadata: Metadata = {
  title: "My Posts - Centre.com.pk",
  description: "View and manage your blog posts",
};

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <MyPostsClient lang={lang} />;
}
