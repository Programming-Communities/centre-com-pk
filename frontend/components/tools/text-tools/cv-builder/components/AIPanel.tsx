'use client';
import { useState } from 'react';
import { Sparkles, Loader2, X, Settings, Key, Zap } from 'lucide-react';
import { useTheme } from '@/components/theme';

const AI_FEATURES = [
  { id: 'bullet', label: 'Generate Bullet Points', desc: 'Job title → achievement bullets', icon: '✍️' },
  { id: 'summary', label: 'Write Summary', desc: 'Skills + Experience → professional summary', icon: '📝' },
  { id: 'cover', label: 'Cover Letter', desc: 'Resume data → personalized letter', icon: '📧' },
  { id: 'ats', label: 'ATS Keywords', desc: 'Job description → missing keywords', icon: '🎯' },
  { id: 'quantify', label: 'Quantify Impact', desc: 'Vague → numbers & metrics', icon: '📊' },
];

const AI_PROVIDERS = [
  { id: 'gemini', name: 'Google Gemini', free: '1,500 FREE/day', color: '#4285F4' },
  { id: 'openai', name: 'OpenAI', free: 'Pay-as-you-go', color: '#10A37F' },
  { id: 'claude', name: 'Anthropic Claude', free: 'Pay-as-you-go', color: '#D97706' },
  { id: 'groq', name: 'Groq (Llama 3)', free: 'FREE tier', color: '#F97316' },
  { id: 'deepseek', name: 'DeepSeek', free: 'FREE credits', color: '#6366F1' },
];

export default function AIPanel() {
  const { themeColors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [useBuiltIn, setUseBuiltIn] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Say "Connection successful!" in one line.', provider, apiKey }),
      });
      const data = await res.json();
      setTestResult(data.text ? '✅ Connected!' : '❌ Failed');
    } catch (e) {
      setTestResult('❌ Network error');
    }
    setTesting(false);
  };

  const saveSettings = () => {
    localStorage.setItem('cv-ai-settings', JSON.stringify({ provider, useBuiltIn }));
    setShowSettings(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        style={{ background: `linear-gradient(135deg, #9333ea, #7c3aed)`, color: 'white' }}>
        <Sparkles className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-4 z-50 w-80 rounded-2xl shadow-2xl border p-4 animate-in slide-in-from-bottom-2"
          style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
              <Sparkles className="w-5 h-5 text-purple-500" /> AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-black/5"><X className="w-4 h-4" /></button>
          </div>

          {showSettings ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">⚙️ AI Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={useBuiltIn} onChange={() => setUseBuiltIn(true)} /> Use Centre.com.pk AI (Subscription)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={!useBuiltIn} onChange={() => setUseBuiltIn(false)} /> Use My Own API Key (FREE)
                </label>
              </div>
              {!useBuiltIn && (
                <>
                  <select value={provider} onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm">
                    {AI_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.free})</option>)}
                  </select>
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API key..." className="w-full px-3 py-2 rounded-lg border text-sm" />
                  <div className="flex gap-2">
                    <button onClick={testConnection} disabled={testing}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-green-500 disabled:opacity-50">
                      {testing ? <Loader2 className="w-3 h-3 animate-spin inline" /> : 'Test'}
                    </button>
                    <button onClick={saveSettings} className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: themeColors.primary }}>
                      Save
                    </button>
                  </div>
                  {testResult && <p className="text-xs text-center">{testResult}</p>}
                  <p className="text-xs text-center text-green-600">💡 Gemini = 1,500 FREE requests/day!</p>
                </>
              )}
              <button onClick={() => setShowSettings(false)} className="w-full py-1.5 text-xs text-gray-500">← Back</button>
            </div>
          ) : (
            <div className="space-y-2">
              {AI_FEATURES.map(f => (
                <button key={f.id}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg border text-left hover:bg-black/5 transition-colors"
                  style={{ borderColor: themeColors.border }}>
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{f.label}</div>
                    <div className="text-xs" style={{ color: themeColors.text.secondary }}>{f.desc}</div>
                  </div>
                </button>
              ))}
              <button onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border"
                style={{ borderColor: themeColors.border, color: themeColors.text.secondary }}>
                <Settings className="w-3.5 h-3.5" /> Configure AI Settings
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
