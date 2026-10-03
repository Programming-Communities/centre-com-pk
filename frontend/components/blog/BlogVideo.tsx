'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function BlogVideo({ videoId, title }: { videoId: string; title: string }) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const staticColors = { textPrimary: '#0f172a' };
  const colors = mounted ? {
    textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
  } : staticColors;

  if (!videoId) return null;

  return (
    <section suppressHydrationWarning className="my-8">
      <h2 suppressHydrationWarning className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}><Play size={24} style={{ color: '#ef4444' }} />Video Tutorial</h2>
      <div suppressHydrationWarning className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%', backgroundColor: '#000' }}>
        <iframe src={`https://www.youtube.com/embed/${videoId}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full" style={{ border: 'none' }} />
      </div>
    </section>
  );
}
