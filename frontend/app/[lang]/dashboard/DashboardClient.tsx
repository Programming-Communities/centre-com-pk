'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  FileText, Bookmark, MessageCircle, Crown, Megaphone, DollarSign, 
  Plus, ShoppingBag, Link2, Edit3, Wrench, Users, Settings,
  FolderOpen, Globe, BarChart3, Shield, Zap, Palette, Code2
} from 'lucide-react';

export default function DashboardClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token');
    const data = localStorage.getItem('user_data');
    if (token && data) {
      try { setUser(JSON.parse(data)); } catch(e) {}
    } else {
      window.location.href = `/${lang}/auth/signin`;
    }
  }, [lang]);

  if (!mounted || !user) return null;

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const labels: Record<string, any> = {
    en: { 
      welcome: 'Welcome back', plan: 'Plan', documents: 'Documents', bookmarks: 'Bookmarks', 
      comments: 'Comments', ads: 'My Ads', affiliate: 'Affiliate', free: 'FREE', unlimited: 'UNLIMITED', 
      admin: 'ADMIN', newDoc: 'New Document', buyPlan: 'Buy Package', submitAd: 'Submit Ad', 
      affLink: 'Affiliate Link', manageTools: 'Tools Manager', manageUsers: 'Manage Users', 
      manageBlog: 'Blog Manager', manageSEO: 'SEO Manager', manageAds: 'Ad Manager',
      manageSite: 'Site Settings', viewSite: 'View Site', allTools: 'All Tools',
      recent: 'Recent Documents', noDocs: 'No documents yet', createFirst: 'Create First Document',
      adminPanel: 'Admin Controls', userPanel: 'Your Dashboard',
      quickActions: 'Quick Actions', stats: 'Overview'
    },
    ur: { welcome: 'واپس خوش آمدید', plan: 'پلان', documents: 'دستاویزات', bookmarks: 'بک مارکس', comments: 'تبصرے', ads: 'اشتہارات', affiliate: 'افیلیٹ', free: 'مفت', unlimited: 'لا محدود', admin: 'ایڈمن', newDoc: 'نیا', buyPlan: 'پلان خریدیں', submitAd: 'اشتہار', affLink: 'افیلیٹ لنک', manageTools: 'ٹولز مینیجر', manageUsers: 'یوزرز', manageBlog: 'بلاگ', manageSEO: 'SEO', manageAds: 'ایڈز', manageSite: 'سیٹنگز', viewSite: 'سائٹ', allTools: 'ٹولز', recent: 'حالیہ', noDocs: 'کوئی نہیں', createFirst: 'پہلا بنائیں', adminPanel: 'ایڈمن کنٹرول', userPanel: 'آپ کا ڈیش بورڈ', quickActions: 'فوری ایکشن', stats: 'جائزہ' },
    hi: { welcome: 'वापसी पर स्वागत', plan: 'प्लान', documents: 'दस्तावेज़', bookmarks: 'बुकमार्क', comments: 'टिप्पणियाँ', ads: 'विज्ञापन', affiliate: 'सहबद्ध', free: 'मुफ्त', unlimited: 'असीमित', admin: 'एडमिन', newDoc: 'नया', buyPlan: 'प्लान', submitAd: 'विज्ञापन', affLink: 'लिंक', manageTools: 'टूल्स', manageUsers: 'यूजर्स', manageBlog: 'ब्लॉग', manageSEO: 'SEO', manageAds: 'विज्ञापन', manageSite: 'सेटिंग्स', viewSite: 'साइट', allTools: 'टूल्स', recent: 'हालिया', noDocs: 'कोई नहीं', createFirst: 'पहला', adminPanel: 'एडमिन पैनल', userPanel: 'आपका डैशबोर्ड', quickActions: 'त्वरित कार्रवाई', stats: 'अवलोकन' },
    ar: { welcome: 'مرحباً', plan: 'الخطة', documents: 'مستندات', bookmarks: 'إشارات', comments: 'تعليقات', ads: 'إعلانات', affiliate: 'عمولة', free: 'مجاني', unlimited: 'غير محدود', admin: 'مدير', newDoc: 'جديد', buyPlan: 'شراء', submitAd: 'إعلان', affLink: 'رابط', manageTools: 'أدوات', manageUsers: 'مستخدمين', manageBlog: 'مدونة', manageSEO: 'SEO', manageAds: 'إعلانات', manageSite: 'إعدادات', viewSite: 'الموقع', allTools: 'أدوات', recent: 'حديثاً', noDocs: 'لا يوجد', createFirst: 'أنشئ', adminPanel: 'لوحة المدير', userPanel: 'لوحتك', quickActions: 'إجراءات', stats: 'نظرة عامة' },
  };
  const l = labels[lang] || labels.en;

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: textPrimary, margin: '0 0 4px' }}>
              {l.welcome}, {user?.name || 'User'}! 👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: 700, 
                background: isAdmin ? '#f59e0b20' : '#3b82f620', color: isAdmin ? '#f59e0b' : '#3b82f6' }}>
                {isAdmin ? '👑 ' + l.unlimited + ' ' + l.plan : '📦 ' + l.free + ' ' + l.plan}
              </span>
              {isAdmin && (
                <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: 700, background: '#ef444420', color: '#ef4444' }}>
                  🔴 {l.admin}
                </span>
              )}
            </div>
          </div>
          <Link href={`/${lang}`} style={{ padding: '10px 20px', background: surface, color: primary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} /> {l.viewSite}
          </Link>
        </div>

        {/* ADMIN PANEL — Only visible to admin */}
        {isAdmin && (
          <div style={{ marginBottom: '28px', padding: '24px', background: surface, borderRadius: '16px', border: `2px solid #f59e0b40`, boxShadow: isDarkMode ? '0 8px 32px rgba(245,158,11,0.1)' : '0 4px 16px rgba(245,158,11,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} /> {l.adminPanel}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {[
                { icon: Wrench, label: l.manageTools, href: `/${lang}/admin/tools-manager`, color: '#10b981' },
                { icon: Edit3, label: l.manageBlog, href: `/${lang}/admin/posts`, color: '#8b5cf6' },
                { icon: Users, label: l.manageUsers, href: `/${lang}/admin/users`, color: '#ef4444' },
                { icon: Globe, label: l.manageSEO, href: `/${lang}/admin/seo-manager`, color: '#3b82f6' },
                { icon: Megaphone, label: l.manageAds, href: `/${lang}/admin/dashboard/ads`, color: '#ec4899' },
                { icon: Settings, label: l.manageSite, href: `/${lang}/admin/dashboard/settings`, color: '#6366f1' },
                { icon: BarChart3, label: 'Analytics', href: `/${lang}/admin/dashboard/analytics`, color: '#14b8a6' },
                { icon: FolderOpen, label: l.allTools, href: `/${lang}/tools`, color: '#f97316' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '14px 16px', background: `${item.color}10`, borderRadius: '10px', border: `1px solid ${item.color}30`, textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <item.icon size={22} color={item.color} style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{item.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { icon: FileText, value: '0', label: l.documents, color: '#3b82f6' },
            { icon: Bookmark, value: '0', label: l.bookmarks, color: '#8b5cf6' },
            { icon: MessageCircle, value: '0', label: l.comments, color: '#10b981' },
            { icon: Crown, value: isAdmin ? l.unlimited : l.free, label: l.plan, color: '#f59e0b' },
            { icon: Megaphone, value: '0', label: l.ads, color: '#ec4899' },
            { icon: DollarSign, value: '$0', label: l.affiliate, color: '#14b8a6' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '18px 14px', backgroundColor: surface, borderRadius: '12px', border: `1px solid ${border}`, textAlign: 'center', transition: 'transform 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <stat.icon size={22} style={{ color: stat.color, marginBottom: '8px' }} />
              <div style={{ fontSize: '20px', fontWeight: 700, color: textPrimary }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: textSecondary, marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color={primary} /> {l.quickActions}
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href={`/${lang}/dashboard/editor`} style={{ padding: '12px 22px', background: primary, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 6px 16px ${primary}30` }}>
              <Plus size={16} /> {l.newDoc}
            </Link>
            {!isAdmin && (
              <Link href={`/${lang}/dashboard/plan`} style={{ padding: '12px 22px', background: surface, color: textPrimary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={16} /> {l.buyPlan}
              </Link>
            )}
            <Link href={`/${lang}/dashboard/ads`} style={{ padding: '12px 22px', background: surface, color: textPrimary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Megaphone size={16} /> {l.submitAd}
            </Link>
            <Link href={`/${lang}/dashboard/affiliate`} style={{ padding: '12px 22px', background: surface, color: textPrimary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link2 size={16} /> {l.affLink}
            </Link>
          </div>
        </div>

        {/* RECENT DOCUMENTS */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color={primary} /> {l.recent}
          </h2>
          <div style={{ padding: '40px 20px', backgroundColor: surface, borderRadius: '12px', border: `1px solid ${border}`, textAlign: 'center', color: textSecondary }}>
            <FileText size={36} style={{ marginBottom: '10px', opacity: 0.3 }} />
            <p style={{ margin: '0 0 10px', fontSize: '15px' }}>{l.noDocs}</p>
            <Link href={`/${lang}/dashboard/editor`} style={{ color: primary, fontWeight: 600, fontSize: '14px' }}>{l.createFirst} →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
