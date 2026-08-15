import { Metadata } from "next";
import AdvertiseClient from "./AdvertiseClient";
export const metadata: Metadata = { title: "Advertise - Centre.com.pk" };
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <AdvertiseClient lang={lang} />;
}
