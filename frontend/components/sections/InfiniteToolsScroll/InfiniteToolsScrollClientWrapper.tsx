'use client';

import dynamic from 'next/dynamic';

// ✅ Client Component — ssr: false allowed here
const InfiniteToolsScrollClient = dynamic(
  () => import('./InfiniteToolsScrollClient'),
  { 
    ssr: false, 
    loading: () => <div className="h-64 bg-surface/50 rounded-xl animate-pulse" />
  }
);

interface Props {
  lang: string;
}

export default function InfiniteToolsScrollWrapper({ lang }: Props) {
  return <InfiniteToolsScrollClient lang={lang} />;
}
