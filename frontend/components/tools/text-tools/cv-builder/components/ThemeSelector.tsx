'use client';
import { useContext } from 'react';
import { CVContext } from '../tool.client';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/components/theme';

const TEMPLATES = [
  { id: 'professional-blue', name: 'Professional Blue', colors: ['#2563eb', '#1e40af', '#dbeafe'] },
  { id: 'modern-minimal', name: 'Modern Minimal', colors: ['#111827', '#374151', '#f3f4f6'] },
  { id: 'creative-bold', name: 'Creative Bold', colors: ['#9333ea', '#7c3aed', '#f3e8ff'] },
  { id: 'executive-dark', name: 'Executive Dark', colors: ['#1e293b', '#0f172a', '#94a3b8'] },
  { id: 'tech-startup', name: 'Tech Startup', colors: ['#0d9488', '#0f766e', '#ccfbf1'] },
  { id: 'academic-scholar', name: 'Academic Scholar', colors: ['#7c3aed', '#6d28d9', '#ede9fe'] },
  { id: 'fresher-green', name: 'Fresher Green', colors: ['#059669', '#047857', '#d1fae5'] },
  { id: 'freelancer-portfolio', name: 'Freelancer Portfolio', colors: ['#f59e0b', '#d97706', '#fef3c7'] },
  { id: 'medical-professional', name: 'Medical Professional', colors: ['#0891b2', '#0e7490', '#cffafe'] },
  { id: 'teaching-educator', name: 'Teaching Educator', colors: ['#4f46e5', '#4338ca', '#e0e7ff'] },
  { id: 'pakistani-classic', name: 'Pakistani Classic', colors: ['#15803d', '#166534', '#dcfce7'] },
  { id: 'government-job', name: 'Government Job', colors: ['#1e40af', '#1e3a8a', '#dbeafe'] },
  { id: 'creative-designer', name: 'Creative Designer', colors: ['#db2777', '#be185d', '#fce7f3'] },
  { id: 'executive-suite', name: 'Executive Suite', colors: ['#374151', '#1f2937', '#e5e7eb'] },
  { id: 'compact-one-page', name: 'Compact One-Page', colors: ['#475569', '#334155', '#f8fafc'] },
];

export default function ThemeSelector() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
        <Palette className="w-5 h-5" style={{ color: themeColors.primary }} />Choose Template
      </h3>
      <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
        {TEMPLATES.map((tpl) => (
          <button key={tpl.id} onClick={() => dispatch({ type: 'SET_TEMPLATE', payload: tpl.id })}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
              state.template === tpl.id ? 'shadow-md' : 'hover:shadow-sm'
            }`}
            style={state.template === tpl.id ? { borderColor: themeColors.primary } : { borderColor: themeColors.border }}>
            <div className="flex gap-1">
              {tpl.colors.map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{tpl.name}</div>
            </div>
            {state.template === tpl.id && <Check className="w-4 h-4" style={{ color: themeColors.primary }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
