'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Play } from 'lucide-react';

export default function BlogVideo({ videoId, title }: { videoId: string; title: string }) {
  const { themeColors } = useTheme();
  if (!videoId) return null;

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: themeColors?.text?.primary }}><Play size={24} style={{ color: '#ef4444' }} />Video Tutorial</h2>
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%', backgroundColor: '#000' }}>
        <iframe src={`https://www.youtube.com/embed/${videoId}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full" style={{ border: 'none' }} />
      </div>
    </section>
  );
}
