'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useParams, useRouter } from 'next/navigation';
import { Check, Zap, Crown, Building, Shield, Star, ArrowRight } from 'lucide-react';

export default function PricingClient() {
  const { lang } = useParams() as { lang: string };
  const router = useRouter();
  const { themeColors, isDarkMode } = useTheme();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    fetch('/api/payments?action=packages')
      .then(r => r.json())
      .then(d => { setPackages(d.packages || []); setLoading(false); });
  }, []);

  const handleBuy = (pkg: any) => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/' + lang + '/auth/signin'); return; }
    router.push('/' + lang + '/dashboard/plan?package=' + pkg.id);
  };

  const iconMap: Record<number, any> = { 0: Zap, 1: Crown, 2: Building };

  return (
    <div style={{ padding: '60px 20px', minHeight: '80vh', background: isDarkMode ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', fontFamily: themeColors.fontFamily }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: textPrimary, marginBottom: '12px' }}>💰 Choose Your Plan</h1>
        <p style={{ fontSize: '18px', color: textSecondary, marginBottom: '48px' }}>Unlock premium features and boost your productivity</p>

        {loading ? (
          <div style={{ color: textSecondary }}>Loading plans...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {packages.map((pkg: any) => {
              const Icon = iconMap[pkg.id] || Zap;
              const isPopular = pkg.is_popular === 1;
              const features = JSON.parse(pkg.features || '[]');
              return (
                <div key={pkg.id} style={{
                  padding: '36px 28px', background: surface, borderRadius: '20px',
                  border: isPopular ? '2px solid ' + primary : '1px solid ' + border,
                  position: 'relative', transform: isPopular ? 'scale(1.03)' : 'none',
                  boxShadow: isPopular ? '0 8px 40px ' + primary + '20' : '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex', flexDirection: 'column'
                }}>
                  {isPopular && (
                    <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', padding: '6px 20px', background: primary, color: '#fff', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} /> Most Popular
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '24px' }}>
                    <Icon size={32} color={primary} style={{ marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>{pkg.name}</h3>
                    <p style={{ fontSize: '14px', color: textSecondary }}>{pkg.description}</p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    {pkg.original_price > pkg.price && (
                      <span style={{ fontSize: '16px', color: textSecondary, textDecoration: 'line-through', marginRight: '8px' }}>
                        {pkg.currency} {pkg.original_price}
                      </span>
                    )}
                    <span style={{ fontSize: '42px', fontWeight: 800, color: textPrimary }}>
                      {pkg.price === 0 ? 'FREE' : pkg.currency + ' ' + pkg.price}
                    </span>
                    {pkg.price > 0 && <span style={{ fontSize: '14px', color: textSecondary }}>/{pkg.duration_days}d</span>}
                  </div>

                  <div style={{ marginBottom: '28px', flex: 1 }}>
                    {features.map((f: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '14px', color: textPrimary }}>
                        <Check size={16} color="#10b981" /> {f}
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handleBuy(pkg)}
                    style={{ padding: '14px', borderRadius: '12px', border: 'none', background: isPopular ? primary : 'transparent', color: isPopular ? '#fff' : primary, fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: isPopular ? 'none' : '1px solid ' + primary, transition: 'all 0.2s' }}>
                    {pkg.price === 0 ? 'Get Started Free' : 'Buy Now'} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
