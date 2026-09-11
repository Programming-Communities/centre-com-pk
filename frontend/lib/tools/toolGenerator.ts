// lib/tools/toolGenerator.ts
export type ToolType = 'calculator' | 'formatter' | 'converter' | 'generator' | 'custom';

export interface ToolInput {
  name: string;
  slug: string;
  category: string;
  icon: string;
  type: ToolType;
  description: string;
  config?: any;
  seo?: any;
  translations?: any;
}

export function generateToolComponent(input: ToolInput): string {
  const { name, type } = input;

  const base = `'use client';
import { useState } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function ${toPascal(name)}Tool() {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);
  useState(() => { setTimeout(() => setMounted(true), 0); });
  const colors = mounted ? themeColors : {
    background: '#ffffff', surface: '#f8fafc', textPrimary: '#0f172a',
    textSecondary: '#334155', border: '#e2e8f0', primary: '#1d4ed8',
  };`;

  if (type === 'calculator') {
    return `${base}
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  return (
    <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.surface }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>${name}</h2>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value"
        className="w-full p-3 rounded-xl border mb-4"
        style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} />
      <button onClick={() => setResult('Result: ' + value)} className="w-full py-3 rounded-xl font-semibold text-white"
        style={{ backgroundColor: colors.primary }}>Calculate</button>
      {result && <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors.background, color: colors.primary }}>{result}</div>}
    </div>
  );
}`;
  }

  return `${base}
  return (
    <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.surface }}>
      <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>${name}</h2>
    </div>
  );
}`;
}

function toPascal(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}