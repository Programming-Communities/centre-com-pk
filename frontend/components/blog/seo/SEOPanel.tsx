'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Star, Eye, Globe, Hash } from 'lucide-react';

interface SEOPanelProps {
  title: string;
  content: string;
  excerpt: string;
  focusKeyword: string;
  onUpdate: (data: any) => void;
}

export default function SEOPanel({ title, content, excerpt, focusKeyword, onUpdate }: SEOPanelProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [seoScore, setSeoScore] = useState(0);

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';
  const success = '#10b981';
  const warning = '#f59e0b';
  const error = '#ef4444';

  useEffect(() => {
    let score = 0;
    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
    const kw = focusKeyword.toLowerCase();

    if (title.length > 0) score += 10;
    if (title.length <= 60) score += 5;
    if (kw && title.toLowerCase().includes(kw)) score += 5;

    if (wordCount >= 1500) score += 20;
    else if (wordCount >= 1000) score += 15;
    else if (wordCount >= 500) score += 10;

    if (excerpt.length >= 150 && excerpt.length <= 160) score += 15;
    else if (excerpt.length > 0) score += 5;

    if (kw) {
      const count = (content.toLowerCase().match(new RegExp(kw, 'g')) || []).length;
      if (count >= 3) score += 15;
      else if (count >= 1) score += 8;
    }

    if (seoTitle.length > 0) score += 10;
    if (seoDescription.length >= 150 && seoDescription.length <= 160) score += 10;
    if (keywords.length >= 3) score += 5;
    score += 5;

    setSeoScore(Math.min(100, score));
  }, [title, content, excerpt, focusKeyword, seoTitle, seoDescription, keywords]);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };
  const removeKeyword = (kw: string) => setKeywords(keywords.filter(k => k !== kw));

  const getScoreColor = (s: number) => s >= 80 ? success : s >= 60 ? warning : error;
  const getScoreLabel = (s: number) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs Improvement';

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${border}`,
    backgroundColor: 'transparent', color: textPrimary, fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: getScoreColor(seoScore) }}>{seoScore}%</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: textPrimary }}>{getScoreLabel(seoScore)}</span>
              <span style={{ fontSize: '12px', color: textSecondary }}>SEO Score</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', backgroundColor: border, marginTop: '4px' }}>
              <div style={{ width: `${seoScore}%`, height: '100%', borderRadius: '3px', backgroundColor: getScoreColor(seoScore) }} />
            </div>
            <div style={{ fontSize: '12px', color: textSecondary, marginTop: '8px' }}>
              📊 Words: {content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, display: 'block', marginBottom: '6px' }}>
          <Star size={14} style={{ display: 'inline', marginRight: '6px', color: primary }} /> Focus Keyword
        </label>
        <input type="text" value={focusKeyword} onChange={(e) => onUpdate({ focusKeyword: e.target.value })} placeholder="Enter primary keyword" style={inputStyle} />
      </div>

      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}><Globe size={14} style={{ display: 'inline', marginRight: '6px', color: primary }} /> SEO Meta</h4>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, display: 'block', marginBottom: '4px' }}>SEO Title</label>
          <input type="text" value={seoTitle || title} onChange={(e) => { setSeoTitle(e.target.value); onUpdate({ seoTitle: e.target.value }); }} placeholder="SEO Title (50-60 chars)" style={inputStyle} />
          <span style={{ fontSize: '11px', color: textSecondary }}>{(seoTitle || title).length}/60</span>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, display: 'block', marginBottom: '4px' }}>Meta Description</label>
          <textarea value={seoDescription || excerpt} onChange={(e) => { setSeoDescription(e.target.value); onUpdate({ seoDescription: e.target.value }); }} placeholder="Meta Description (150-160 chars)" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <span style={{ fontSize: '11px', color: textSecondary }}>{(seoDescription || excerpt).length}/160</span>
        </div>
      </div>

      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}><Hash size={14} style={{ display: 'inline', marginRight: '6px', color: primary }} /> Keywords</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addKeyword()} placeholder="Add keyword..." style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addKeyword} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: primary, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {keywords.map((kw) => (
            <span key={kw} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', backgroundColor: `${primary}15`, color: primary, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {kw} <button onClick={() => removeKeyword(kw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: primary, padding: '0', fontSize: '12px' }}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}><Eye size={14} style={{ display: 'inline', marginRight: '6px', color: primary }} /> Social Preview</h4>
        <div style={{ border: `1px solid ${border}`, borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ height: '80px', background: `linear-gradient(135deg, ${primary}, ${primary}80)` }} />
          <div style={{ padding: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>{seoTitle || title || 'Post Title'}</div>
            <div style={{ fontSize: '12px', color: textSecondary, marginTop: '4px' }}>{seoDescription || excerpt || 'Post description'}</div>
            <div style={{ fontSize: '10px', color: textSecondary, marginTop: '4px' }}>centre.com.pk</div>
          </div>
        </div>
      </div>
    </div>
  );
}
