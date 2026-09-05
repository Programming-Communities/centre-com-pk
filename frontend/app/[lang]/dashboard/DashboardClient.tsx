'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  FileText, Bookmark, MessageCircle, Crown, Megaphone, DollarSign, 
  Plus, ShoppingBag, Link2, Globe, Zap
} from 'lucide-react';

export default function DashboardClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ documents: 0, bookmarks: 0, comments: 0, ads: 0, earnings: 0 });
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token');
    const data = localStorage.getItem('user_data');
    if (token && data) {
      try {
        const u = JSON.parse(data);
        setUser(u);
        fetchUserStats(u.id);
      } catch(e) {}
    } else {
      window.location.href = `/${lang}/auth/signin`;
    }
  }, [lang]);

  const fetchUserStats = async (userId: number) => {
    try {
      const [docsRes, bookmarksRes, commentsRes, adsRes] = await Promise.all([
        fetch(`/api/dashboard?user_id=${userId}`),
        fetch(`/api/user/bookmarks?user_id=${userId}`),
        fetch(`/api/admin/comments`),
        fetch(`/api/admin/ads?user_id=${userId}`),
      ]);
      
      const docs = await docsRes.json();
      const bookmarks = await bookmarksRes.json();
      const comments = await commentsRes.json();
      const ads = await adsRes.json();
      
      setStats({
        documents: docs.documents?.length || 0,
        bookmarks: bookmarks.bookmarks?.length || 0,
        comments: comments.comments?.filter((c: any) => c.user_id == userId).length || 0,
        ads: ads.ads?.length || 0,
        earnings: 0,
      });
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  };

  if (!mounted || !user) return null;

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const labels: Record<string, any> = {
    en: { welcome: 'Welcome back', plan: 'Plan', documents: 'Documents', bookmarks: 'Bookmarks', comments: 'Comments', ads: 'My Ads', affiliate: 'Affiliate', free: 'FREE', unlimited: 'UNLIMITED', admin: 'ADMIN', newDoc: 'New Document', buyPlan: 'Buy Package', submitAd: 'Submit Ad', affLink: 'Affiliate Link', viewSite: 'View Site', recent: 'Recent Documents', noDocs: 'No documents yet', createFirst: 'Create First Document', quickActions: 'Quick Actions' },
    ur: { welcome: 'واپس خوش آمدید', plan: 'پلان', documents: 'دستاویزات', bookmarks: 'بک مارکس', comments: 'تبصرے', ads: 'اشتہارات', affiliate: 'افیلیٹ', free: 'مفت', unlimited: 'لا محدود', admin: 'ایڈمن', newDoc: 'نیا', buyPlan: 'پلان خریدیں', submitAd: 'اشتہار', affLink: 'افیلیٹ لنک', viewSite: 'سائٹ', recent: 'حالیہ', noDocs: 'کوئی نہیں', createFirst: 'پہلا بنائیں', quickActions: 'فوری ایکشن' },
    hi: { welcome: 'वापसी पर स्वागत', plan: 'प्लान', documents: 'दस्तावेज़', bookmarks: 'बुकमार्क', comments: 'टिप्पणियाँ', ads: 'विज्ञापन', affiliate: 'सहबद्ध', free: 'मुफ्त', unlimited: 'असीमित', admin: 'एडमिन', newDoc: 'नया', buyPlan: 'प्लान', submitAd: 'विज्ञापन', affLink: 'लिंक', viewSite: 'साइट', recent: 'हालिया', noDocs: 'कोई नहीं', createFirst: 'पहला', quickActions: 'त्वरित कार्रवाई' },
    ar: { welcome: 'مرحباً', plan: 'الخطة', documents: 'مستندات', bookmarks: 'إشارات', comments: 'تعليقات', ads: 'إعلانات', affiliate: 'عمولة', free: 'مجاني', unlimited: 'غير محدود', admin: 'مدير', newDoc: 'جديد', buyPlan: 'شراء', submitAd: 'إعلان', affLink: 'رابط', viewSite: 'الموقع', recent: 'حديثاً', noDocs: 'لا يوجد', createFirst: 'أنشئ', quickActions: 'إجراءات' },
  };
  const l = labels[lang] || labels.en;

  return (
    <div style={{ minHeight: '100vh', padding: '16px 8px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 800, color: textPrimary, margin: '0 0 4px' }}>
              {l.welcome}, {user?.name || 'User'}! 👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '10px', fontWeight: 700, background: isAdmin ? '#f59e0b20' : '#3b82f620', color: isAdmin ? '#f59e0b' : primary }}>
                {isAdmin ? '👑 ' + l.unlimited + ' ' + l.plan : '📦 ' + (user?.plan || 'FREE').toUpperCase() + ' ' + l.plan}
              </span>
              {isAdmin && (
                <span style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '10px', fontWeight: 700, background: '#ef444420', color: '#ef4444' }}>
                  🔴 {l.admin}
                </span>
              )}
            </div>
          </div>
          <Link href={`/${lang}`} style={{ padding: '7px 14px', background: surface, color: primary, borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Globe size={13} /> {l.viewSite}
          </Link>
        </div>

        {/* STATS — DYNAMIC DATA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {[
            { icon: FileText, value: stats.documents, label: l.documents, color: '#3b82f6' },
            { icon: Bookmark, value: stats.bookmarks, label: l.bookmarks, color: '#8b5cf6' },
            { icon: MessageCircle, value: stats.comments, label: l.comments, color: '#10b981' },
            { icon: Crown, value: isAdmin ? l.unlimited : (user?.plan || 'FREE').toUpperCase(), label: l.plan, color: '#f59e0b' },
            { icon: Megaphone, value: stats.ads, label: l.ads, color: '#ec4899' },
            { icon: DollarSign, value: `$${stats.earnings}`, label: l.affiliate, color: '#14b8a6' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '14px 10px', backgroundColor: surface, borderRadius: '10px', border: `1px solid ${border}`, textAlign: 'center' }}>
              <stat.icon size={18} style={{ color: stat.color, marginBottom: '6px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>{stat.value}</div>
              <div style={{ fontSize: '9px', color: textSecondary, marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color={primary} /> {l.quickActions}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            <Link href={`/${lang}/dashboard/editor`} style={{ padding: '10px 12px', background: primary, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Plus size={13} /> {l.newDoc}
            </Link>
            {!isAdmin && (
              <Link href={`/${lang}/dashboard/plan`} style={{ padding: '10px 12px', background: surface, color: textPrimary, borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '11px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <ShoppingBag size={13} /> {l.buyPlan}
              </Link>
            )}
            <Link href={`/${lang}/dashboard/ads`} style={{ padding: '10px 12px', background: surface, color: textPrimary, borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '11px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Megaphone size={13} /> {l.submitAd}
            </Link>
            <Link href={`/${lang}/dashboard/affiliate`} style={{ padding: '10px 12px', background: surface, color: textPrimary, borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '11px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Link2 size={13} /> {l.affLink}
            </Link>
          </div>
        </div>

        {/* RECENT DOCUMENTS */}
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={15} color={primary} /> {l.recent}
          </h2>
          <div style={{ padding: '25px 12px', backgroundColor: surface, borderRadius: '10px', border: `1px solid ${border}`, textAlign: 'center', color: textSecondary }}>
            <FileText size={28} style={{ marginBottom: '6px', opacity: 0.3 }} />
            <p style={{ margin: '0 0 6px', fontSize: '12px' }}>{l.noDocs}</p>
            <Link href={`/${lang}/dashboard/editor`} style={{ color: primary, fontWeight: 600, fontSize: '12px' }}>{l.createFirst} →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
