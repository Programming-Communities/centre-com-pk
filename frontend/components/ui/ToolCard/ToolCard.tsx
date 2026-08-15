// components/ui/ToolCard/ToolCard.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ToolCardProps {
  tool: {
    title: string;
    slug: string;
    category: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  compact?: boolean;
  lang?: string;
}

// ✅ HARD-CODED FALLBACKS FOR ALL LANGUAGES
const getButtonTexts = (lang: string) => {
  const texts: Record<string, any> = {
    ur: { 
      free: 'مفت', 
      use: 'استعمال کریں', 
      noInstall: '🔧 انسٹالیشن کی ضرورت نہیں' 
    },
    ar: { 
      free: 'مجاني', 
      use: 'استخدام', 
      noInstall: '🔧 لا يتطلب التثبيت' 
    },
    hi: { 
      free: 'मुफ्त', 
      use: 'उपयोग करें', 
      noInstall: '🔧 इंस्टॉलेशन की आवश्यकता नहीं' 
    },
    en: { 
      free: 'Free', 
      use: 'Use', 
      noInstall: '🔧 No installation required' 
    }
  };
  return texts[lang] || texts.en;
};

export default function ToolCard({
  tool,
  compact = false,
  lang = "en",
}: ToolCardProps) {
  
  const { t } = useTranslation({ namespace: "common" });
  
  const getToolUrl = () => `/${lang}/tools/${tool.category}/${tool.slug}`;
  const toolUrl = getToolUrl();

  const getTranslatedCategory = () => {
    const categoryKey = tool.category.replace(/-/g, '_');
    const translated = t(`category_list.${categoryKey}`);
    if (translated !== `category_list.${categoryKey}`) return translated;
    
    const translated2 = t(`category_list.${tool.category}`);
    if (translated2 !== `category_list.${tool.category}`) return translated2;
    
    return tool.category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const categoryName = getTranslatedCategory();
  
  const buttonTexts = getButtonTexts(lang);
  const freeText = t('tool.free') !== 'tool.free' ? t('tool.free') : buttonTexts.free;
  const useText = t('action.use') !== 'action.use' ? t('action.use') : buttonTexts.use;
  const noInstallText = t('tool.no_install') !== 'tool.no_install' ? t('tool.no_install') : buttonTexts.noInstall;

  if (compact) {
    return (
      <Link
        href={toolUrl}
        className="block p-3 rounded-lg border border-border bg-surface hover:bg-surface-light transition-all duration-300"
        prefetch={false}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{tool.icon || "🔧"}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate text-text-primary">{tool.title}</div>
            <div className="text-xs truncate mt-1 text-text-secondary">{categoryName}</div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={toolUrl}
      className="group block p-6 rounded-xl border border-border bg-surface hover:bg-surface-light hover:shadow-theme-medium hover:-translate-y-0.5 transition-all duration-300"
      prefetch={false}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{tool.icon || "🛠️"}</span>
          <span className="text-xs font-medium px-2 py-1 rounded-full border bg-primary-10 text-primary border-primary-30">
            {categoryName}
          </span>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-2 text-text-primary">{tool.title}</h3>
          <p className="text-sm line-clamp-2 text-text-secondary">
            {tool.description || t('tool.default_description', 'Free online tool')}
          </p>
        </div>

        {/* ✅ FIXED: Added gap-2 */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-text-secondary">{noInstallText}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/20 text-success">
              {freeText}
            </span>
            <span className="text-sm font-medium text-primary group-hover:text-primary-hover transition-colors flex items-center">
              {useText}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}