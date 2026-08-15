'use client';
import dynamic from 'next/dynamic';

// ✅ FIXED: lang prop add kiya!
interface PopularToolsClientProps {
  tools: any[];
  lang: string;  // ✅ YEH ADD KARO!
}

const PopularToolsSection = dynamic(
  () => import('./PopularToolsSection'),
  { 
    loading: () => <div className="h-64 bg-surface rounded-xl animate-pulse" />,
    ssr: false 
  }
);

export default function PopularToolsClient({ tools, lang }: PopularToolsClientProps) {
  // ✅ lang prop ko aage pass karo!
  return <PopularToolsSection tools={tools} lang={lang} />;
}