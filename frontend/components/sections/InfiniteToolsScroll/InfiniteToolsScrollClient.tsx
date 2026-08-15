'use client';
import dynamic from 'next/dynamic';

// ✅ FIXED: lang prop add kiya!
interface InfiniteToolsScrollClientProps {
  lang: string;  // ✅ YEH ADD KARO!
}

const InfiniteToolsScroll = dynamic(
  () => import('./InfiniteToolsScroll'),
  { 
    loading: () => <div className="h-96 bg-surface rounded-xl animate-pulse" />,
    ssr: false 
  }
);

export default function InfiniteToolsScrollClient({ lang }: InfiniteToolsScrollClientProps) {
  // ✅ lang prop ko aage pass karo!
  return <InfiniteToolsScroll lang={lang} />;
}