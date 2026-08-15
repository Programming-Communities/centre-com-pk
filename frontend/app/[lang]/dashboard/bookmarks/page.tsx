import { Metadata } from "next";
import BookmarksClient from "./BookmarksClient";
export const metadata: Metadata = { title: "Bookmarks - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <BookmarksClient lang={lang} />;
}
