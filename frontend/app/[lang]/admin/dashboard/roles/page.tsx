import RolesClient from "./RolesClient";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <RolesClient lang={lang} />;
}
