'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface AdData {
  id: number; title: string; description: string; image_url: string;
  target_url: string; ad_type: string; custom_html: string;
  placement: string; size: string; client_name: string; client_company: string;
}

interface DynamicAdProps {
  placement: string;
  blogPostId?: string;
  toolSlug?: string;
  limit?: number;
  className?: string;
}

export default function DynamicAd({ placement, blogPostId, toolSlug, limit = 3 }: DynamicAdProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [ads, setAds] = useState<AdData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({ placement, limit: String(limit) });
    if (blogPostId) params.set('blog_post_id', blogPostId);
    if (toolSlug) params.set('tool_slug', toolSlug);
    
    fetch(`/api/ads/public?${params}`)
      .then(r => r.json())
      .then(d => { if (d.success) setAds(d.ads); })
      .catch(() => {});
  }, [placement, blogPostId, toolSlug, limit]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) {
    // Show Google AdSense placeholder
    return (
      <div style={{
        padding: '20px', textAlign: 'center', borderRadius: '12px',
        backgroundColor: themeColors.surface || '#fff',
        border: `1px dashed ${themeColors.border || '#e2e8f0'}`,
        minHeight: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: themeColors.text?.secondary || '#94a3b8', fontSize: '13px'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>📢</div>
          <div>Advertisement</div>
          <div style={{ fontSize: '10px', opacity: 0.6 }}>Google AdSense — Available Soon</div>
        </div>
      </div>
    );
  }

  const ad = ads[currentIndex];

  const handleClick = () => {
    fetch('/api/ads/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad.id }),
    }).catch(() => {});
  };

  // Google AdSense type
  if (ad.ad_type === 'google_adsense') {
    return (
      <div style={{
        padding: '20px', textAlign: 'center', borderRadius: '12px',
        backgroundColor: themeColors.surface || '#fff',
        border: `1px solid ${themeColors.border || '#e2e8f0'}`,
        minHeight: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div dangerouslySetInnerHTML={{ __html: ad.custom_html || '<!-- Google AdSense -->' }} />
      </div>
    );
  }

  // Custom HTML type
  if (ad.ad_type === 'custom_html') {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: ad.custom_html || '' }} />
    );
  }

  // Image/Client/Sponsor type
  return (
    <a href={ad.target_url || '#'} target="_blank" rel="noopener noreferrer"
      onClick={handleClick}
      style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        backgroundColor: themeColors.surface || '#fff',
        border: `1px solid ${themeColors.border || '#e2e8f0'}`,
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
      }}>
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.title}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '250px', objectFit: 'cover' }} />
        ) : (
          <div style={{
            padding: '30px 20px', textAlign: 'center',
            background: `linear-gradient(135deg, ${themeColors.primary || '#3b82f6'}15, ${themeColors.secondary || '#7c3aed'}15)`,
            minHeight: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📢</div>
            <h4 style={{ margin: '0 0 4px', color: themeColors.text?.primary, fontSize: '15px', fontWeight: 600 }}>{ad.title}</h4>
            {ad.description && <p style={{ margin: 0, color: themeColors.text?.secondary, fontSize: '12px' }}>{ad.description}</p>}
          </div>
        )}
        {(ad.client_name || ad.client_company) && (
          <div style={{ padding: '8px 12px', fontSize: '10px', color: themeColors.text?.secondary || '#94a3b8', textAlign: 'center', borderTop: `1px solid ${themeColors.border || '#e2e8f0'}` }}>
            {ad.ad_type === 'sponsor' ? '🤝 Sponsored' : '📢'} by {ad.client_company || ad.client_name}
          </div>
        )}
      </div>
    </a>
  );
}
