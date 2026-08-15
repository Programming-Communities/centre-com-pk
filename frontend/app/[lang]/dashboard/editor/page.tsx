import { Metadata } from "next";
import EditorClient from "./EditorClient";

export const metadata: Metadata = {
  title: "Document Editor - Centre.com.pk",
  description: "Create and edit documents with rich text editor",
};

export default async function EditorPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <EditorClient lang={lang} />;
}
