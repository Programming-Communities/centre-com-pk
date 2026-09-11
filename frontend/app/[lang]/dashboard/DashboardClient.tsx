'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  FileText, Bookmark, MessageCircle, Crown, Megaphone, DollarSign, 
  Plus, ShoppingBag, Link2, Globe, Zap, Bell, TrendingUp, Eye, MousePointer,
  Clock, CheckCircle, Activity, BarChart3, ArrowRight
} from 'lucide-react';

export default function DashboardClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ documents: 0, bookmarks: 0, comments: 0, ads: 0, earnings: 0 });
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>({ ads: [], earnings: [] });
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token');
    const data = localStorage.getItem('user_data');
    if (token && data) {
      try {
        const u = JSON.parse(data);
        setUser(u);
        fetchAllData(u.id || u.email);
      } catch(e) {}
    } else {
      window.location.href = `/${lang}/auth/signin`;
    }
  }, [lang]);

  const fetchAllData = async (userId: string | number) => {
    try {
      // Fetch all in parallel
      const [docsRes, bookmarksRes, commentsRes, adsRes] = await Promise.all([
        fetch(`/api/dashboard?user_id=${userId}`).then(r => r.json()).catch(() => ({ documents: [] })),
        fetch(`/api/user/bookmarks?user_id=${userId}`).then(r => r.json()).catch(() => ({ bookmarks: [] })),
        fetch(`/api/admin/comments`).then(r => r.json()).catch(() => ({ comments: [] })),
        fetch(`/api/admin/ads?user_id=${userId}`).then(r => r.json()).catch(() => ({ ads: [] })),
      ]);

      const docs = docsRes.documents || [];
      const bookmarks = bookmarksRes.bookmarks || [];
      const userComments = (commentsRes.comments || []).filter((c: any) => c.user_id == userId);
      const ads = adsRes.ads || [];

      setStats({
        documents: docs.length,
        bookmarks: bookmarks.length,
        comments: userComments.length,
        ads: ads.length,
        earnings: 0,
      });

      setRecentDocs(docs.slice(0, 3));
      setRecentAds(ads.slice(0, 3));

      // Generate activity feed
      const activityFeed: any[] = [];
      
      docs.slice(0, 2).forEach((doc: any) => {
        activityFeed.push({
          id: `doc-${doc.id}`,
          icon: FileText,
          color: '#3b82f6',
          text: `Document "${doc.title}" ${doc.updated_at ? 'updated' : 'created'}`,
          time: doc.updated_at || doc.created_at,
        });
      });

      userComments.slice(0, 2).forEach((comment: any) => {
        activityFeed.push({
          id: `comment-${comment.id}`,
          icon: MessageCircle,
          color: '#10b981',
          text: `Comment ${comment.status === 'approved' ? 'approved' : 'pending'}`,
          time: comment.created_at,
        });
      });

      ads.slice(0, 2).forEach((ad: any) => {
        activityFeed.push({
          id: `ad-${ad.id}`,
          icon: Megaphone,
          color: '#ec4899',
          text: `Ad "${ad.title}" — ${ad.status}`,
          time: ad.created_at,
        });
      });

      // Sort by time
      activityFeed.sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime());
      setActivities(activityFeed.slice(0, 5));

      // Chart data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      setChartData({
        ads: last7Days.map(day => ({
          date: day,
          count: ads.filter((a: any) => a.created_at?.startsWith(day)).length,
        })),
        earnings: last7Days.map(day => ({
          date: day,
          amount: 0,
        })),
      });

    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
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
    en: { 
      welcome: 'Welcome back', plan: 'Plan', documents: 'Documents', bookmarks: 'Bookmarks', 
      comments: 'Comments', ads: 'My Ads', affiliate: 'Affiliate', free: 'FREE', unlimited: 'UNLIMITED', 
      admin: 'ADMIN', newDoc: 'New Document', buyPlan: 'Buy Package', submitAd: 'Submit Ad', 
      affLink: 'Affiliate Link', viewSite: 'View Site', recent: 'Recent Documents', 
      noDocs: 'No documents yet', createFirst: 'Create First Document', quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity', adsPerformance: 'Ads Performance', noActivity: 'No recent activity',
      overview: 'Overview', viewAll: 'View All', notifications: 'Notifications',
    },
    ur: { 
      welcome: 'واپس خوش آمدید', plan: 'پلان', documents: 'دستاویزات', bookmarks: 'بک مارکس', 
      comments: 'تبصرے', ads: 'اشتہارات', affiliate: 'افیلیٹ', free: 'مفت', unlimited: 'لا محدود', 
      admin: 'ایڈمن', newDoc: 'نیا', buyPlan: 'پلان خریدیں', submitAd: 'اشتہار', 
      affLink: 'افیلیٹ لنک', viewSite: 'سائٹ', recent: 'حالیہ', noDocs: 'کوئی نہیں', 
      createFirst: 'پہلا بنائیں', quickActions: 'فوری ایکشن', recentActivity: 'حالیہ سرگرمی',
      adsPerformance: 'اشتہارات کی کارکردگی', noActivity: 'کوئی سرگرمی نہیں', 
      overview: 'جائزہ', viewAll: 'سب دیکھیں', notifications: 'اطلاعات',
    },
    hi: { 
      welcome: 'वापसी पर स्वागत', plan: 'प्लान', documents: 'दस्तावेज़', bookmarks: 'बुकमार्क', 
      comments: 'टिप्पणियाँ', ads: 'विज्ञापन', affiliate: 'सहबद्ध', free: 'मुफ्त', unlimited: 'असीमित', 
      admin: 'एडमिन', newDoc: 'नया', buyPlan: 'प्लान', submitAd: 'विज्ञापन', 
      affLink: 'लिंक', viewSite: 'साइट', recent: 'हालिया', noDocs: 'कोई नहीं', 
      createFirst: 'पहला', quickActions: 'त्वरित कार्रवाई', recentActivity: 'हाल की गतिविधि',
      adsPerformance: 'विज्ञापन प्रदर्शन', noActivity: 'कोई गतिविधि नहीं', 
      overview: 'अवलोकन', viewAll: 'सभी देखें', notifications: 'सूचनाएं',
    },
    ar: { 
      welcome: 'مرحباً', plan: 'الخطة', documents: 'مستندات', bookmarks: 'إشارات', 
      comments: 'تعليقات', ads: 'إعلانات', affiliate: 'عمولة', free: 'مجاني', unlimited: 'غير محدود', 
      admin: 'مدير', newDoc: 'جديد', buyPlan: 'شراء', submitAd: 'إعلان', 
      affLink: 'رابط', viewSite: 'الموقع', recent: 'حديثاً', noDocs: 'لا يوجد', 
      createFirst: 'أنشئ', quickActions: 'إجراءات', recentActivity: 'النشاط الأخير',
      adsPerformance: 'أداء الإعلانات', noActivity: 'لا يوجد نشاط', 
      overview: 'نظرة عامة', viewAll: 'عرض الكل', notifications: 'الإشعارات',
    },
  };
  const l = labels[lang] || labels.en;

  // Helper: time ago
  const timeAgo = (date: string) => {
    if (!date) return '';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 12px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ========== HEADER ========== */}
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '7px 12px', background: surface, color: textSecondary, borderRadius: '8px', border: `1px solid ${border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
              <Bell size={14} />
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            </button>
            <Link href={`/${lang}`} style={{ padding: '7px 14px', background: surface, color: primary, borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={13} /> {l.viewSite}
            </Link>
          </div>
        </div>

        {/* ========== STATS CARDS (6) ========== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {[
            { icon: FileText, value: stats.documents, label: l.documents, color: '#3b82f6' },
            { icon: Bookmark, value: stats.bookmarks, label: l.bookmarks, color: '#8b5cf6' },
            { icon: MessageCircle, value: stats.comments, label: l.comments, color: '#10b981' },
           { 
  icon: Crown, 
  value: isAdmin ? '∞' : (user?.plan || 'FREE').toUpperCase(), 
  label: isAdmin ? 'UNLIMITED' : l.plan, 
  color: '#f59e0b' 
},
            { icon: Megaphone, value: stats.ads, label: l.ads, color: '#ec4899' },
            { icon: DollarSign, value: `$${stats.earnings}`, label: l.affiliate, color: '#14b8a6' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '16px', backgroundColor: surface, borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: textPrimary, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: textSecondary, marginTop: '3px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ========== CHARTS (2 columns) ========== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Ads Performance Chart */}
          <div style={{ padding: '16px', backgroundColor: surface, borderRadius: '12px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart3 size={16} color={primary} /> {l.adsPerformance}
              </h3>
              <span style={{ fontSize: '10px', color: textSecondary }}>Last 7 days</span>
            </div>
            {/* Simple bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px' }}>
              {chartData.ads.map((d: any, i: number) => {
                const maxCount = Math.max(...chartData.ads.map((x: any) => x.count), 1);
                const height = (d.count / maxCount) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '9px', color: textSecondary, fontWeight: 600 }}>{d.count}</div>
                    <div style={{ width: '100%', height: `${Math.max(height, 5)}%`, background: `linear-gradient(to top, ${primary}, ${primary}80)`, borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease', minHeight: '4px' }} />
                    <div style={{ fontSize: '8px', color: textSecondary }}>
                      {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ padding: '16px', backgroundColor: surface, borderRadius: '12px', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} color={primary} /> {l.recentActivity}
            </h3>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: textSecondary, fontSize: '12px' }}>
                {l.noActivity}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activities.map((a: any) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <a.icon size={13} style={{ color: a.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: textPrimary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</div>
                      <div style={{ fontSize: '10px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={9} /> {timeAgo(a.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========== QUICK ACTIONS ========== */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color={primary} /> {l.quickActions}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            <Link href={`/${lang}/dashboard/editor`} style={{ padding: '14px 12px', background: primary, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Plus size={14} /> {l.newDoc}
            </Link>
            {!isAdmin && (
              <Link href={`/${lang}/dashboard/plan`} style={{ padding: '14px 12px', background: surface, color: textPrimary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShoppingBag size={14} /> {l.buyPlan}
              </Link>
            )}
            <Link href={`/${lang}/dashboard/ads`} style={{ padding: '14px 12px', background: surface, color: textPrimary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Megaphone size={14} /> {l.submitAd}
            </Link>
            <Link href={`/${lang}/dashboard/affiliate`} style={{ padding: '14px 12px', background: surface, color: textPrimary, borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Link2 size={14} /> {l.affLink}
            </Link>
          </div>
        </div>

        {/* ========== RECENT DOCUMENTS ========== */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color={primary} /> {l.recent}
            </h2>
            {recentDocs.length > 0 && (
              <Link href={`/${lang}/dashboard/editor`} style={{ fontSize: '11px', color: primary, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                {l.viewAll} <ArrowRight size={11} />
              </Link>
            )}
          </div>
          
          {recentDocs.length === 0 ? (
            <div style={{ padding: '40px 16px', backgroundColor: surface, borderRadius: '12px', border: `1px solid ${border}`, textAlign: 'center', color: textSecondary }}>
              <FileText size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
              <p style={{ margin: '0 0 8px', fontSize: '13px' }}>{l.noDocs}</p>
              <Link href={`/${lang}/dashboard/editor`} style={{ color: primary, fontWeight: 600, fontSize: '12px', textDecoration: 'none' }}>
                {l.createFirst} →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentDocs.map((doc: any) => (
                <Link key={doc.id} href={`/${lang}/dashboard/editor/${doc.id}`} style={{ 
                  padding: '14px 16px', backgroundColor: surface, borderRadius: '10px', 
                  border: `1px solid ${border}`, textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={16} color={primary} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.title || 'Untitled'}
                    </div>
                    <div style={{ fontSize: '10px', color: textSecondary, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Clock size={9} /> {timeAgo(doc.updated_at || doc.created_at)}
                      {doc.word_count && <span>• {doc.word_count} words</span>}
                    </div>
                  </div>
                  <ArrowRight size={14} color={textSecondary} />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}