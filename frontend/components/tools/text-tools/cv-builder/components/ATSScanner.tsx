'use client';
import { useState, useContext } from 'react';
import { CVContext } from '../tool.client';
import { Target, Search, Zap, Loader2, Check, X } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function ATSScanner() {
  const { state } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [jobDesc, setJobDesc] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scanATS = () => {
    if (!jobDesc.trim()) return;
    setIsScanning(true);
    
    setTimeout(() => {
      const resumeText = JSON.stringify(state).toLowerCase();
      const jobWords = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];
      const uniqueWords = [...new Set(jobWords.filter(w => w.length > 3))];
      
      const matched = uniqueWords.filter(w => resumeText.includes(w));
      const missing = uniqueWords.filter(w => !resumeText.includes(w));
      const score = Math.round((matched.length / uniqueWords.length) * 100);
      
      setResults({
        score: Math.min(100, score),
        matched: matched.slice(0, 10),
        missing: missing.slice(0, 10),
        totalKeywords: uniqueWords.length,
        matchPercent: Math.round((matched.length / uniqueWords.length) * 100),
      });
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
        <Target className="w-5 h-5" style={{ color: themeColors.primary }} />ATS Scanner
      </h3>
      
      <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste job description here to check keyword match..."
        rows={4}
        className="w-full px-3 py-2 rounded-lg border text-xs resize-none" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
      
      <button onClick={scanATS} disabled={!jobDesc.trim() || isScanning}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: themeColors.primary }}>
        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {isScanning ? 'Scanning...' : 'Scan ATS Match'}
      </button>

      {results && (
        <div className="space-y-3 animate-in fade-in">
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color: results.score >= 70 ? '#10b981' : results.score >= 50 ? '#f59e0b' : '#ef4444' }}>
              {results.score}%
            </div>
            <div className="text-xs" style={{ color: themeColors.text.secondary }}>ATS Compatibility</div>
          </div>
          
          <div>
            <p className="text-xs font-medium mb-1.5" style={{ color: themeColors.primary }}>
              ✅ Matched Keywords ({results.matched.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {results.matched.map((w: string) => (
                <span key={w} className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{w}</span>
              ))}
            </div>
          </div>

          {results.missing.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: '#ef4444' }}>
                ❌ Missing Keywords ({results.missing.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {results.missing.map((w: string) => (
                  <span key={w} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">{w}</span>
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>Add these keywords to improve your ATS score!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
