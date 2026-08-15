'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface AdData {
  id: number; title: string; description: string; image_url: string;
  target_url: string; ad_type: string; custom_html: string;
  placement: string; size: string; client_name: string; client_company: string;
}

interface AdDisplayProps {
  placement?: string;
  blogPostId?: string;
  toolSlug?: string;
  limit?: number;
  className?: string;
}

export default function AdDisplay({ placement = 'header', blogPostId, toolSlug, limit = 1 }: AdDisplayProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams({ placement, limit: String(limit) });
    if (blogPostId) params.set('blog_post_id', blogPostId);
    if (toolSlug) params.set('tool_slug', toolSlug);
    
    fetch('/api/ads/public?' + params.toString())
      .then(r => r.json())
      .then(d => {
        if (d.success && d.ads?.length > 0) {
          setAds(d.ads);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mounted, placement, blogPostId, toolSlug, limit]);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const handleClick = async (adId: number) => {
    try {
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      });
    } catch {}
  };

  if (!mounted || loading) return null;
  if (ads.length === 0) return null;

  const ad = ads[currentIndex];
  if (!ad) return null;

  const surface = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const textSecondary = themeColors.text?.secondary || '#94a3b8';

  // Google AdSense type
  if (ad.ad_type === 'google_adsense' && ad.custom_html) {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', margin: '16px 0' }}>
        <div dangerouslySetInnerHTML={{ __html: ad.custom_html }} />
      </div>
    );
  }

  // Custom HTML type
  if (ad.ad_type === 'custom_html' && ad.custom_html) {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', margin: '16px 0' }}>
        <div dangerouslySetInnerHTML={{ __html: ad.custom_html }} />
      </div>
    );
  }

  // Standard Banner Ad
  return (
    <div style={{ margin: '16px 0', textAlign: 'center' }}>
      <a href={ad.target_url || '#'} target="_blank" rel="noopener noreferrer"
        onClick={() => handleClick(ad.id)}
        style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          borderRadius: '12px', overflow: 'hidden', backgroundColor: surface,
          border: '1px solid ' + border, transition: 'box-shadow 0.2s, transform 0.2s',
          cursor: 'pointer', position: 'relative'
        }}>
          {ad.image_url ? (
            <img src={ad.image_url} alt={ad.title}
              style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{
              padding: '30px 20px', minHeight: '90px',
              background: 'linear-gradient(135deg, ' + (themeColors.primary || '#3b82f6') + '10, ' + (themeColors.secondary || '#7c3aed') + '10)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>📢</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: themeColors.text?.primary || '#0f172a' }}>{ad.title}</div>
              {ad.description && <div style={{ fontSize: '12px', color: textSecondary, marginTop: '4px' }}>{ad.description}</div>}
            </div>
          )}
          
          {/* Sponsor Label */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            padding: '3px 10px', borderRadius: '12px',
            background: 'rgba(0,0,0,0.6)', color: '#fff',
            fontSize: '10px', fontWeight: 600
          }}>
            {ad.ad_type === 'sponsor' ? '🤝 Sponsored' : '📢 Ad'}
          </div>
          
          {/* Click indicator */}
          {ad.target_url && (
            <div style={{
              padding: '6px 12px', fontSize: '10px', color: textSecondary,
              textAlign: 'center', borderTop: '1px solid ' + border,
              background: isDarkMode ? '#0f172a' : '#f8fafc'
            }}>
              {ad.client_company || ad.client_name || 'Sponsored'} • Click to learn more →
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
