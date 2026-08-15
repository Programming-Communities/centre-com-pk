'use client';
import { useState, useContext } from 'react';
import { CVContext } from '../tool.client';
import { FileText, Sparkles, Loader2, Download, Copy } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function CoverLetter() {
  const { state } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [letter, setLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLetter = async () => {
    if (!company || !position) return;
    setIsGenerating(true);
    const skills = state.skills?.map((s: any) => s.name || s).join(', ') || '';
    const exp = state.experience?.map((e: any) => e.position).filter(Boolean).join(', ') || '';
    const prompt = `Write a professional cover letter for ${position} at ${company}. Skills: ${skills}. Experience: ${exp}. Keep it 3 paragraphs.`;
    
    try {
      const res = await fetch('/api/ai/suggest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, type: 'cover_letter' }) });
      const data = await res.json();
      if (data.text) setLetter(data.text);
    } catch (e) { console.error('AI failed:', e); }
    setIsGenerating(false);
  };

  const copyLetter = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
        <FileText className="w-5 h-5" style={{ color: themeColors.primary }} />Cover Letter
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name" className="px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
          placeholder="Job Position" className="px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
      </div>

      <button onClick={generateLetter} disabled={!company || !position || isGenerating}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: themeColors.primary }}>
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
      </button>

      {letter && (
        <div className="space-y-2">
          <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={8}
            className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
            style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
          <div className="flex gap-2">
            <button onClick={copyLetter}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium"
              style={{ borderColor: themeColors.border, color: themeColors.text.primary }}>
              {copied ? '✓ Copied!' : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
            <button onClick={() => { const blob = new Blob([letter], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'cover-letter.txt'; a.click(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium"
              style={{ borderColor: themeColors.border, color: themeColors.text.primary }}>
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
