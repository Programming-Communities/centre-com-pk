
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Code, Copy, Download, Settings } from "lucide-react";
import ResponsiveToolWrapper from "@/components/tools/ResponsiveToolWrapper/ResponsiveToolWrapper.client";
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function CssFormatterClient() {
  const [inputCss, setInputCss] = useState<string>(`.container{width:100%;margin:0 auto;}.header{background:#333;color:white;padding:20px;}nav ul{margin:0;padding:0;list-style:none;}nav li{display:inline-block;margin-right:20px;}`);
  const [formattedCss, setFormattedCss] = useState<string>("");
  const [indentSize, setIndentSize] = useState<number>(2);
  
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  


  const { themeColors } = useTheme();
  
  // ✅ HYDration FIX
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Safe colors (light theme during SSR)
  const colors = mounted ? themeColors : {
    background: '#ffffff',
    surface: '#f8fafc',
    text: { primary: '#0f172a', secondary: '#334155', accent: '#ffffff' },
    border: '#e2e8f0',
    primary: '#1d4ed8',
    secondary: '#1e40af',
  };

  const formatCss = () => {
    try {
      let formatted = inputCss;
      
      // Basic CSS formatting
      formatted = formatted
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n\n')
        .replace(/\s*;\s*/g, ';\n')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();

      // Add indentation
      let indentLevel = 0;
      const lines = formatted.split('\n');
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        if (trimmed === '}') {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indent = ' '.repeat(indentLevel * indentSize);
        const result = indent + trimmed;

        if (trimmed.endsWith('{')) {
          indentLevel++;
        }

        return result;
      });

      setFormattedCss(formattedLines.filter(line => line !== '').join('\n'));
    } catch (error) {
      setFormattedCss('Error formatting CSS. Please check your input.');
    }
  };

  useEffect(() => {
    formatCss();
  }, []); // Fixed: useEffect instead of useState

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedCss);
      alert('CSS copied to clipboard!');
    } catch (err) {
      alert('Failed to copy CSS');
    }
  };

  const downloadCss = () => {
    const blob = new Blob([formattedCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputCss('');
    setFormattedCss('');
  };

  return (
    <ResponsiveToolWrapper>

      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">CSS Formatter</h1>
          <p className="text-text-secondary">Beautify and organize your CSS code with proper formatting</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="rounded-lg border" style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border
            }}>
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <Code className="h-5 w-5" style={{ color: colors.primary }} />
                  Input CSS
                </h2>
                <button
                  onClick={clearAll}
                  className="text-error hover:opacity-80 text-sm transition-colors"
                  style={{ color: colors.error }}
                >
                  Clear All
                </button>
              </div>
              <textarea
                value={inputCss}
                onChange={(e) => setInputCss(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm focus:outline-none resize-none"
                placeholder="Paste your CSS code here..."
                spellCheck="false"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  caretColor: colors.primary
                }}
              />
            </div>

            {/* Formatting Options */}
            <div className="rounded-lg border p-6" style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border
            }}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text.primary }}>
                <Settings className="h-5 w-5" style={{ color: colors.primary }} />
                Formatting Options
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                    Indent Size: {indentSize} spaces
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="2"
                    value={indentSize}
                    onChange={(e) => {
                      setIndentSize(Number(e.target.value));
                      formatCss();
                    }}
                    className="w-full"
                    style={{
                      accentColor: colors.primary
                    }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.text.secondary }}>
                    <span>2 spaces</span>
                    <span>4 spaces</span>
                    <span>8 spaces</span>
                  </div>
                </div>

                <button
                  onClick={formatCss}
                  className="w-full py-3 px-4 rounded-lg hover:opacity-90 transition-colors font-semibold"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.text.accent
                  }}
                >
                  Format CSS
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="rounded-lg border" style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border
            }}>
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                <h2 className="text-lg font-semibold" style={{ color: colors.text.primary }}>Formatted CSS</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!formattedCss}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:opacity-80 transition-colors text-sm disabled:opacity-50"
                    style={{ 
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary,
                      border: `1px solid ${colors.primary}30`
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadCss}
                    disabled={!formattedCss}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:opacity-80 transition-colors text-sm disabled:opacity-50"
                    style={{ 
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary,
                      border: `1px solid ${colors.primary}30`
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
              <pre 
                className="w-full h-96 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.text.primary
                }}
              >
                {formattedCss || 'Formatted CSS will appear here...'}
              </pre>
            </div>

            {/* CSS Tips */}
            <div 
              className="rounded-lg p-6"
              style={{ 
                backgroundColor: `${colors.primary}10`,
                border: `1px solid ${colors.primary}30`
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>CSS Formatting Best Practices</h3>
              <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: colors.primary }}>
                <li>Use consistent indentation (2 or 4 spaces recommended)</li>
                <li>Group related properties together (position, box model, typography, etc.)</li>
                <li>Always include semicolons after declarations</li>
                <li>Use shorthand properties when possible</li>
                <li>Organize selectors logically and alphabetically if needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sample CSS */}
        <div className="mt-8 rounded-lg border p-6" style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}>
          <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>Try Sample CSS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Basic Styling',
                code: `.container{width:100%;max-width:1200px;margin:0 auto;padding:20px;}.button{background:blue;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;}.button:hover{background:darkblue;}`
              },
              {
                name: 'Flexbox Layout',
                code: `.flex-container{display:flex;flex-wrap:wrap;gap:20px;justify-content:space-between;align-items:center;}.flex-item{flex:1 1 300px;min-height:200px;background:#f0f0f0;padding:20px;border-radius:8px;}`
              }
            ].map((sample, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputCss(sample.code);
                  formatCss();
                }}
                className="p-4 rounded-lg border transition-colors text-left"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = colors.background;
                }}
              >
                <div className="font-semibold text-sm mb-2">{sample.name}</div>
                <div className="text-xs font-mono truncate" style={{ color: colors.text.secondary }}>
                  {sample.code}
                </div>
              </button>
            ))}
          </div>
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
        </div>
      </div>
    </ResponsiveToolWrapper>

  );

}
