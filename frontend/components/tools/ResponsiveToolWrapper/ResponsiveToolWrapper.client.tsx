// components/tools/ResponsiveToolWrapper/ResponsiveToolWrapper.client.tsx
"use client";

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
    leftRail: false,    // ✅ CHANGED: false karo
    rightRail: false,   // ✅ CHANGED: false karo
    topBanner: true,
    bottomBanner: true,
    railSize: { width: 160, height: 600 },
    bannerSize: { width: 970, height: 250 }
  },
  className = ""
}: ResponsiveToolWrapperProps) {
  const { themeColors } = useTheme();

  return (
    <div 
      className={`responsive-tool-wrapper ${className}`}
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="responsive-tool-container">
        {/* Left Rail Ad - Desktop only */}
        {showAds && adConfig.leftRail && (
          <div className="left-rail-ad desktop-only">
            <AdRail 
              position="left" 
              size={adConfig.railSize}
              title="Left Rail Ad"
            />
          </div>
        )}

        {/* Right Rail Ad - Desktop only */}
        {showAds && adConfig.rightRail && (
          <div className="right-rail-ad desktop-only">
            <AdRail 
              position="right" 
              size={adConfig.railSize}
              title="Right Rail Ad"
            />
          </div>
        )}

        {/* Main Content Container */}
        <div className="tool-content-wrapper">
          {/* Top Banner Ad */}
          {showAds && adConfig.topBanner && (
            <div className="top-banner-ad">
              <AdBanner 
                position="top"
                size={adConfig.bannerSize}
                title="Top Banner Ad"
              />
            </div>
          )}

          {/* Main Content */}
          <div 
            className="tool-main-content"
            style={{ 
              backgroundColor: themeColors.surface,
              color: themeColors.text.primary,
              border: `1px solid ${themeColors.border}`
            }}
          >
            {children}
          </div>

          {/* Bottom Banner Ad */}
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