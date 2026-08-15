'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export default function BlogComparison({ title, rows, competitor1Name, competitor2Name }: { title: string; rows: { feature: string; ourTool: string; competitor1: string; competitor2: string }[]; competitor1Name: string; competitor2Name: string }) {
  const { themeColors } = useTheme();
  const getIcon = (value: string) => {
    if (value.includes('✅')) return <CheckCircle size={18} color="#10b981" />;
    if (value.includes('❌')) return <XCircle size={18} color="#ef4444" />;
    if (value.includes('⚠️')) return <MinusCircle size={18} color="#f59e0b" />;
    return <span style={{ fontSize: '13px' }}>{value}</span>;
  };

  return (
    <section className="my-8 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors?.text?.primary }}>{title}</h2>
      <table className="w-full border-collapse rounded-xl overflow-hidden" style={{ border: `1px solid ${themeColors?.border}` }}>
        <thead><tr style={{ backgroundColor: themeColors?.primary + '15' }}><th className="p-3 text-left text-sm font-bold">Feature</th><th className="p-3 text-center text-sm font-bold" style={{ color: themeColors?.primary }}>⭐ Centre.com.pk</th><th className="p-3 text-center text-sm">{competitor1Name}</th><th className="p-3 text-center text-sm">{competitor2Name}</th></tr></thead>
        <tbody>{rows.map((row, i) => (<tr key={i} style={{ borderTop: `1px solid ${themeColors?.border}`, backgroundColor: i % 2 === 0 ? themeColors?.surface : 'transparent' }}><td className="p-3 text-sm font-medium">{row.feature}</td><td className="p-3 text-center">{getIcon(row.ourTool)}</td><td className="p-3 text-center">{getIcon(row.competitor1)}</td><td className="p-3 text-center">{getIcon(row.competitor2)}</td></tr>))}</tbody>
      </table>
    </section>
  );
}
