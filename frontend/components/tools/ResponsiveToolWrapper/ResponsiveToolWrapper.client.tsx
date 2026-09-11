'use client';
// components/tools/ResponsiveToolWrapper/ResponsiveToolWrapper.client.tsx

import { useState, useEffect } from 'react';
import AdRail from "./AdRail";
import AdBanner from "./AdBanner";
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import './ResponsiveToolWrapper.module.css'; 

interface ResponsiveToolWrapperProps {
  children: React.ReactNode;
  showAds?: boolean;
  adConfig?: {
    leftRail?: boolean;
    rightRail?: boolean;
    topBanner?: boolean;
    bottomBanner?: boolean;
    railSize?: { width: number; height: number };
    bannerSize?: { width: number; height: number };
  };
  className?: string;
}

export default function ResponsiveToolWrapper({ 
  children, 
  showAds = true,
  adConfig = {
    leftRail: false,
    rightRail: false,
    topBanner: true,
    bottomBanner: true,
    railSize: { width: 160, height: 600 },
    bannerSize: { width: 970, height: 250 }
  },
  className = ""
}: ResponsiveToolWrapperProps) {
  const { themeColors } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const colors = mounted ? themeColors : {
    background: '#ffffff',
    surface: '#f8fafc',
    text: { primary: '#0f172a', secondary: '#334155', accent: '#ffffff' },
    border: '#e2e8f0',
    primary: '#1d4ed8',
    secondary: '#1e40af',
  };

  return (
    <div suppressHydrationWarning 
      className={`responsive-tool-wrapper ${className}`}
      style={{ backgroundColor: colors.background }}
    >
      <div className="responsive-tool-container">
        {showAds && adConfig.leftRail && (
          <div className="left-rail-ad desktop-only">
            <AdRail 
              position="left" 
              size={adConfig.railSize}
              title="Left Rail Ad"
            />
          </div>
        )}

        {showAds && adConfig.rightRail && (
          <div className="right-rail-ad desktop-only">
            <AdRail 
              position="right" 
              size={adConfig.railSize}
              title="Right Rail Ad"
            />
          </div>
        )}

        <div className="tool-content-wrapper">
          {showAds && adConfig.topBanner && (
            <div className="top-banner-ad">
              <AdBanner 
                position="top"
                size={adConfig.bannerSize}
                title="Top Banner Ad"
              />
            </div>
          )}

          <div 
            className="tool-main-content"
            style={{ 
              backgroundColor: colors.surface,
              color: colors.text.primary,
              border: `1px solid ${colors.border}`
            }}
          >
            {children}
          </div>

          {showAds && adConfig.bottomBanner && (
            <div className="bottom-banner-ad">
              <AdBanner 
                position="bottom"
                size={adConfig.bannerSize}
                title="Bottom Banner Ad"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}