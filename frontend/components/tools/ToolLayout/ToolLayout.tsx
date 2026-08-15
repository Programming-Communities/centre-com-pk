// components/tools/ToolLayout/ToolLayout.tsx
"use client";

import './ToolLayout.css';

interface ToolLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showAds?: boolean;
}

export default function ToolLayout({ 
  children, 
  sidebar,
  showAds = true
}: ToolLayoutProps) {
  return (
    <article className="tool-layout-container" itemScope itemType="https://schema.org/SoftwareApplication">
      {/* Top Ad Banner */}
      {showAds && (
        <section className="top-ad ad-banner" aria-label="Advertisement">
          <div className="ad-content">
            <span>Advertisement</span>
            <div className="ad-size">970x250</div>
          </div>
        </section>
      )}
      
      <div className="tool-layout-grid">
        
        {/* Sidebar (Desktop only) */}
        {sidebar && (
          <aside className="tool-sidebar desktop-only" aria-label="Tool sidebar">
            {sidebar}
            
            {/* Sidebar Ad */}
            {showAds && (
              <section className="sidebar-ad" aria-label="Advertisement">
                <div className="ad-content">
                  <span>Advertisement</span>
                  <div className="ad-size">300x250</div>
                </div>
              </section>
            )}
          </aside>
        )}
        
        {/* Main Content */}
        <main className="tool-main-content" role="main" aria-label="Tool content">
          {children}
          
          {/* In-content Ads for Mobile/Tablet */}
          {showAds && (
            <section className="mobile-ads mobile-tablet-only" aria-label="Advertisement">
              <div className="ad-content">
                <span>Advertisement</span>
                <div className="ad-size">320x100</div>
              </div>
            </section>
          )}
        </main>
        
      </div>
      
      {/* Bottom Ad Banner */}
      {showAds && (
        <section className="bottom-ad ad-banner" aria-label="Advertisement">
          <div className="ad-content">
            <span>Advertisement</span>
            <div className="ad-size">970x250</div>
          </div>
        </section>
      )}
    </article>
  );
}