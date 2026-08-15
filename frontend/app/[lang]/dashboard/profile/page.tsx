import { Metadata } from "next";
import ProfileClient from "./ProfileClient";
export const metadata: Metadata = { title: "Profile - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <ProfileClient lang={lang} />;
}
