'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function BlogFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const { themeColors } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const staticColors = {
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    surface: '#ffffff',
    primary: '#3b82f6',
  };

  const colors = mounted ? {
    textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
    textSecondary: themeColors?.text?.secondary || staticColors.textSecondary,
    border: themeColors?.border || staticColors.border,
    surface: themeColors?.surface || staticColors.surface,
    primary: themeColors?.primary || staticColors.primary,
  } : staticColors;

  if (!faqs?.length) return null;

  return (
    <section suppressHydrationWarning className="my-8">
      <h2 suppressHydrationWarning className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: colors.textPrimary }}>
        <HelpCircle size={24} style={{ color: colors.primary }} /> FAQ
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} suppressHydrationWarning className="rounded-xl border overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left font-semibold" suppressHydrationWarning style={{ color: colors.textPrimary }}>
              {faq.question}<ChevronDown size={18} style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', flexShrink: 0 }} />
            </button>
            {openIndex === i && <div suppressHydrationWarning className="px-4 pb-4 border-t pt-3" style={{ borderColor: colors.border, color: colors.textSecondary }}>{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
