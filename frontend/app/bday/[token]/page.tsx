import type { Metadata } from "next";
import BDayCardView from "./BDayCardView";

type Props = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Shared Birthday Card | Centre.com.pk",
    description: "View a shared age calculation card from Centre.com.pk",
    robots: { index: false, follow: false },
  };
}

export default async function BDayPage({ params }: Props) {
  const { token } = await params;
  return <BDayCardView token={token} />;
}

