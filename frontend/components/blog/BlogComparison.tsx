'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export default function BlogComparison({ title, rows, competitor1Name, competitor2Name }: { title: string; rows: { feature: string; ourTool: string; competitor1: string; competitor2: string }[]; competitor1Name: string; competitor2Name: string }) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const staticColors = {
    textPrimary: '#0f172a',
    border: '#e2e8f0',
    surface: '#ffffff',
    primary: '#3b82f6',
  };

  const colors = mounted ? {
    textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
    border: themeColors?.border || staticColors.border,
    surface: themeColors?.surface || staticColors.surface,
    primary: themeColors?.primary || staticColors.primary,
  } : staticColors;

  const getIcon = (value: string) => {
    if (value.includes('✅')) return <CheckCircle size={18} color="#10b981" />;
    if (value.includes('❌')) return <XCircle size={18} color="#ef4444" />;
    if (value.includes('⚠️')) return <MinusCircle size={18} color="#f59e0b" />;
    return <span style={{ fontSize: '13px' }}>{value}</span>;
  };

  return (
    <section suppressHydrationWarning className="my-8 overflow-x-auto">
      <h2 suppressHydrationWarning className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>{title}</h2>
      <table suppressHydrationWarning className="w-full border-collapse rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <thead><tr style={{ backgroundColor: colors.primary + '15' }}><th className="p-3 text-left text-sm font-bold">Feature</th><th className="p-3 text-center text-sm font-bold" style={{ color: colors.primary }}>⭐ Centre.com.pk</th><th className="p-3 text-center text-sm">{competitor1Name}</th><th className="p-3 text-center text-sm">{competitor2Name}</th></tr></thead>
        <tbody>{rows.map((row, i) => (<tr key={i} style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: i % 2 === 0 ? colors.surface : 'transparent' }}><td className="p-3 text-sm font-medium">{row.feature}</td><td className="p-3 text-center">{getIcon(row.ourTool)}</td><td className="p-3 text-center">{getIcon(row.competitor1)}</td><td className="p-3 text-center">{getIcon(row.competitor2)}</td></tr>))}</tbody>
      </table>
    </section>
  );
}
