'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface ToolData {
  slug: string;
  name: string;
  category: string;
  icon?: string;
}

interface RelatedToolsProps {
  toolSlugs: string;
  lang?: string;
  title?: string;
  maxTools?: number;
}

const TOOL_ICONS: Record<string, string> = {
  'age-calculator': '🎂',
  'bmi-calculator': '⚖️',
  'loan-calculator': '💰',
  'currency-converter': '💱',
  'percentage-calculator': '📊',
  'date-calculator': '📅',
  'tip-calculator': '💵',
  'gpa-calculator': '📚',
  'compound-interest': '📈',
  'unit-converter': '📏',
  'image-compressor': '🗜️',
  'image-converter': '🖼️',
  'image-resizer': '📐',
  'image-cropper': '✂️',
  'background-remover': '🎯',
  'pdf-compressor': '📄',
  'pdf-merger': '📎',
  'pdf-splitter': '✂️',
  'pdf-to-word': '📝',
  'password-generator': '🔐',
  'hash-generator': '🔑',
  'encryption-tools': '🔒',
  'ssl-checker': '🛡️',
  'qr-code-generator': '📱',
  'json-formatter': '{}',
  'html-formatter': '<>',
  'css-formatter': '🎨',
  'url-encoder': '🔗',
  'base64-encoder': '6️⃣4️⃣',
  'word-counter': '📝',
  'character-counter': '🔤',
  'case-converter': 'Aa',
  'text-diff': '📋',
  'lorem-ipsum': '📜',
  'markdown-editor': '✏️',
  'uuid-generator': '🆔',
  'color-picker': '🎨',
};

const CATEGORY_MAP: Record<string, string> = {
  'age-calculator': 'calculators',
  'bmi-calculator': 'calculators',
  'loan-calculator': 'calculators',
  'currency-converter': 'calculators',
  'percentage-calculator': 'calculators',
  'date-calculator': 'calculators',
  'tip-calculator': 'calculators',
  'gpa-calculator': 'calculators',
  'compound-interest': 'calculators',
  'unit-converter': 'calculators',
  'image-compressor': 'image-tools',
  'image-converter': 'image-tools',
  'image-resizer': 'image-tools',
  'image-cropper': 'image-tools',
  'background-remover': 'image-tools',
  'image-filters': 'image-tools',
  'image-rotator': 'image-tools',
  'favicon-generator': 'image-tools',
  'meme-generator': 'image-tools',
  'photo-collage': 'image-tools',
  'pdf-compressor': 'pdf-tools',
  'pdf-merger': 'pdf-tools',
  'pdf-splitter': 'pdf-tools',
  'pdf-to-word': 'pdf-tools',
  'password-generator': 'security-tools',
  'hash-generator': 'security-tools',
  'encryption-tools': 'security-tools',
  'ssl-checker': 'security-tools',
  'security-analyzer': 'security-tools',
  'firewall-tester': 'security-tools',
  'data-masking': 'security-tools',
  'secure-file-wipe': 'security-tools',
  'two-factor-auth': 'security-tools',
  'api-security': 'security-tools',
  'qr-code-generator': 'code-tools',
  'json-formatter': 'code-tools',
  'html-formatter': 'code-tools',
  'css-formatter': 'code-tools',
  'javascript-formatter': 'code-tools',
  'xml-formatter': 'code-tools',
  'url-encoder': 'code-tools',
  'base64-encoder': 'code-tools',
  'word-counter': 'text-tools',
  'character-counter': 'text-tools',
  'case-converter': 'text-tools',
  'text-diff': 'text-tools',
  'lorem-ipsum': 'text-tools',
  'markdown-editor': 'text-tools',
  'uuid-generator': 'text-tools',
  'regex-tester': 'text-tools',
  'text-extractor': 'text-tools',
  'cv-builder': 'text-tools',
  'color-picker': 'design-tools',
};

export default function RelatedTools({ toolSlugs, lang = 'en', title = 'Related Free Tools', maxTools = 4 }: RelatedToolsProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [tools, setTools] = useState<ToolData[]>([]);
  
  useEffect(() => {
    if (!toolSlugs) return;
    
    const slugs = toolSlugs.split(',').map(s => s.trim()).filter(Boolean).slice(0, maxTools);
    
    const toolList = slugs.map(slug => ({
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: CATEGORY_MAP[slug] || 'calculators',
      icon: TOOL_ICONS[slug] || '🔧',
    }));
    
    setTools(toolList);
  }, [toolSlugs, maxTools]);
  
  if (tools.length === 0) return null;
  
  const primary = themeColors?.primary || '#3b82f6';
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  
  return (
    <div className="my-10">
      {/* Section Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-secondary/10">
          <Wrench className="w-5 h-5" style={{ color: primary }} />
        </div>
        <h3 className="text-xl font-bold" style={{ color: textPrimary }}>
          🛠️ {title}
        </h3>
      </div>
      
      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${lang}/tools/${tool.category}/${tool.slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            {/* Tool Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              {tool.icon}
            </div>
            
            {/* Tool Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold group-hover:text-primary transition-colors truncate" style={{ color: textPrimary }}>
                {tool.name}
              </h4>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                {tool.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
            
            {/* Arrow */}
            <ArrowRight className="flex-shrink-0 w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: textSecondary }} />
          </Link>
        ))}
      </div>
    </div>
  );
}