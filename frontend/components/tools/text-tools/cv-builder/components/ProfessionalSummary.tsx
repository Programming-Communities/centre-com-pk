'use client';
import { useContext, useState } from 'react';
import { CVContext } from '../tool.client';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function ProfessionalSummary() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const update = (value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'summary', value });
  };

  const generateAI = async () => {
    setIsGenerating(true);
    const skills = state.skills?.map((s: any) => s.name || s).join(', ') || '';
    const exp = state.experience?.map((e: any) => e.position).filter(Boolean).join(', ') || '';
    const prompt = `Write a professional 3-line summary for a CV. Skills: ${skills}. Experience: ${exp}. Make it ATS-friendly.`;
    
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'summary' }),
      });
      const data = await res.json();
      if (data.text) update(data.text);
    } catch (e) { console.error('AI failed:', e); }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <FileText className="w-5 h-5" style={{ color: themeColors.primary }} />Professional Summary
        </h3>
        <button onClick={generateAI} disabled={isGenerating}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: themeColors.primary }}>
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isGenerating ? 'Generating...' : 'AI Generate'}
        </button>
      </div>
      <textarea value={state.summary || ''} onChange={(e) => update(e.target.value)}
        placeholder="Write a brief professional summary highlighting your key skills, experience, and career goals..."
        rows={4}
        className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:ring-2"
        style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
      <p className="text-xs" style={{ color: themeColors.text.secondary }}>
        {(state.summary || '').length} / 500 characters recommended
      </p>
    </div>
  );
}
