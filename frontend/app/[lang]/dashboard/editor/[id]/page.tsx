import { Metadata } from "next";
import EditClient from "./EditClient";

export const metadata: Metadata = {
  title: "Edit Document - Centre.com.pk",
  description: "Edit your document",
};

export default async function EditPage(props: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await props.params;
  return <EditClient lang={lang} id={id} />;
}
