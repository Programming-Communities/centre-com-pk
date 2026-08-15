'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function BlogFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const { themeColors } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!faqs?.length) return null;

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: themeColors?.text?.primary }}>
        <HelpCircle size={24} style={{ color: themeColors?.primary }} /> FAQ
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: themeColors?.border, backgroundColor: themeColors?.surface }}>
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left font-semibold" style={{ color: themeColors?.text?.primary }}>
              {faq.question}<ChevronDown size={18} style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', flexShrink: 0 }} />
            </button>
            {openIndex === i && <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: themeColors?.border, color: themeColors?.text?.secondary }}>{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
