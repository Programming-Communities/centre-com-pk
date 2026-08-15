"use client";

import { getThemeColors } from '@/components/theme/config/themeConfig';
import { Theme } from '@/types/theme'; 

interface ThemeCardProps {
  theme?: string;
  title?: string;
  description?: string;
  isPremium?: boolean;
  onClick?: () => void;
}

export default function ThemeCard({
  theme = 'professional-blue',
  title = 'Theme Preview',
  description = 'Click to select this theme',
  isPremium = false,
  onClick
}: ThemeCardProps) {
  const themeColors = getThemeColors(theme as Theme, false)
  
  return (
    <div 
      className="card group relative"
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
      aria-label={`${title} theme card`}
      tabIndex={onClick ? 0 : -1}
      style={{
        '--card-gradient-start': themeColors.primary,
        '--card-gradient-middle': themeColors.secondary,
        '--card-gradient-end': `color-mix(in srgb, ${themeColors.primary} 70%, black)`,
        '--card-bg': themeColors.background,
        '--card-text': themeColors.text.primary,
        '--card-hover-text': themeColors.primary,
      } as React.CSSProperties}
    >
      <div className="relative z-10 p-6">
        {isPremium && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold">
            PREMIUM
          </div>
        )}
        
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
               style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
            🎨
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: themeColors.text.secondary }}>
            {description}
          </p>
        </div>
        
        <div className="space-y-2">
          {['primary', 'secondary', 'background', 'surface'].map((color) => (
            <div key={color} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: themeColors[color as keyof typeof themeColors] as string }}
              />
              <span className="text-xs capitalize" style={{ color: themeColors.text.secondary }}>
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}