"use client";
import { useState, useEffect } from "react";
import { 
  Share2, Copy, DollarSign, Users, Wallet, Clock, TrendingUp,
  MessageCircle, Facebook, Twitter, Mail, Link2, Check, ChevronRight,
  Gift, Award, Target, Calendar, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function UserAffiliateClient({ lang }: { lang: string }) {
  const { themeColors } = useTheme();
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';
  const isRTL = lang === 'ur' || lang === 'ar';

  const labels: Record<string, any> = {
    en: {
      title: 'Affiliate Program', subtitle: 'Earn 10% commission on every referral',
      referralLink: 'Your Referral Link', copy: 'Copy', copied: 'Copied!',
      totalEarnings: 'Total Earnings', referrals: 'Referrals',
      availableBalance: 'Available Balance', pending: 'Pending',
      requestPayout: 'Request Payout', minPayout: 'Min payout: $10',
      referralList: 'Recent Referrals', noReferrals: 'No referrals yet',
      noReferralsDesc: 'Share your link to start earning!',
      shareVia: 'Share via', earningsChart: 'Earnings (Last 30 Days)',
      joined: 'Joined', earned: 'Earned',
      howItWorks: 'How It Works', step1: 'Share your unique link',
      step2: 'Friends sign up & use tools', step3: 'Earn 10% commission',
    },
    ur: {
      title: 'افیلیٹ پروگرام', subtitle: 'ہر ریفرل پر 10% کمیشن کمائیں',
      referralLink: 'آپ کا ریفرل لنک', copy: 'کاپی', copied: 'کاپی ہو گیا!',
      totalEarnings: 'کل کمائی', referrals: 'ریفرلز',
      availableBalance: 'دستیاب بیلنس', pending: 'زیر التواء',
      requestPayout: 'پیمنٹ کی درخواست', minPayout: 'کم از کم: $10',
      referralList: 'حالیہ ریفرلز', noReferrals: 'ابھی کوئی ریفرل نہیں',
      noReferralsDesc: 'کمانا شروع کرنے کے لیے اپنا لنک شیئر کریں!',
      shareVia: 'شیئر کریں', earningsChart: 'کمائی (آخری 30 دن)',
      joined: 'شامل ہوئے', earned: 'کمایا',
      howItWorks: 'یہ کیسے کام کرتا ہے', step1: 'اپنا لنک شیئر کریں',
      step2: 'دوست سائن اپ اور ٹولز استعمال کریں', step3: '10% کمیشن کمائیں',
    },
    hi: {
      title: 'सहबद्ध कार्यक्रम', subtitle: 'हर रेफरल पर 10% कमीशन कमाएं',
      referralLink: 'आपका रेफरल लिंक', copy: 'कॉपी', copied: 'कॉपी हो गया!',
      totalEarnings: 'कुल कमाई', referrals: 'रेफरल',
      availableBalance: 'उपलब्ध शेष', pending: 'लंबित',
      requestPayout: 'भुगतान का अनुरोध', minPayout: 'न्यूनतम: $10',
      referralList: 'हाल के रेफरल', noReferrals: 'अभी कोई रेफरल नहीं',
      noReferralsDesc: 'कमाना शुरू करने के लिए अपना लिंक साझा करें!',
      shareVia: 'साझा करें', earningsChart: 'कमाई (पिछले 30 दिन)',
      joined: 'शामिल हुए', earned: 'कमाया',
      howItWorks: 'यह कैसे काम करता है', step1: 'अपना लिंक साझा करें',
      step2: 'दोस्त साइन अप और टूल्स उपयोग करें', step3: '10% कमीशन कमाएं',
    },
    ar: {
      title: 'برنامج العمولة', subtitle: 'اكسب 10% عمولة على كل إحالة',
      referralLink: 'رابط الإحالة الخاص بك', copy: 'نسخ', copied: 'تم النسخ!',
      totalEarnings: 'إجمالي الأرباح', referrals: 'الإحالات',
      availableBalance: 'الرصيد المتاح', pending: 'قيد الانتظار',
      requestPayout: 'طلب الدفع', minPayout: 'الحد الأدنى: $10',
      referralList: 'الإحالات الأخيرة', noReferrals: 'لا توجد إحالات بعد',
      noReferralsDesc: 'شارك رابطك لبدء الربح!',
      shareVia: 'شارك عبر', earningsChart: 'الأرباح (آخر 30 يوم)',
      joined: 'انضم', earned: 'كسب',
      howItWorks: 'كيف يعمل', step1: 'شارك رابطك',
      step2: 'الأصدقاء يسجلون ويستخدمون', step3: 'اكسب 10% عمولة',
    },
  };
  const l = labels[lang] || labels.en;

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
        fetchAffiliateData(u.id);
      } catch {}
    }
  }, []);

  const fetchAffiliateData = async (userId: number) => {
    setLoading(true);
    try {
      // Fetch affiliate info
      const affRes = await fetch(`/api/affiliate?user_id=${userId}`);
      const affData = await affRes.json();
      
      if (affData.success && affData.data && affData.data.length > 0) {
        setAffiliate(affData.data[0]);
      } else {
        // Generate referral code if not exists
        const newCode = `user${userId}${Math.random().toString(36).substring(2, 6)}`;
        setAffiliate({
          id: 0,
          user_id: userId,
          referral_code: newCode,
          total_referrals: 0,
          total_earnings: 0,
          available_balance: 0,
          pending_balance: 0,
        });
      }
      
      // Fetch referrals (mock — replace with real API)
      setReferrals([]);
      
      // Fetch earnings (mock — replace with real API)
      setEarnings([]);
      
    } catch {
      // Fallback
      setAffiliate({
        referral_code: `user${userId}`,
        total_referrals: 0,
        total_earnings: 0,
        available_balance: 0,
        pending_balance: 0,
      });
    }
    setLoading(false);
  };

  const refLink = affiliate?.referral_code 
    ? `https://www.centre.com.pk?ref=${affiliate.referral_code}`
    : `https://www.centre.com.pk?ref=user${user?.id || 'guest'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Join Centre.com.pk — Free online tools! Use my link:`;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + refLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(refLink)}`,
      email: `mailto:?subject=Join Centre.com.pk&body=${encodeURIComponent(text + ' ' + refLink)}`,
    };
    window.open(urls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 w-full">
          <div className="max-w-5xl mx-auto text-center py-20" style={{ color: textSecondary }}>
            Loading affiliate data...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)", direction: isRTL ? 'rtl' : 'ltr' }}>
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 w-full">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: textPrimary, margin: '0 0 4px' }}>
              🤝 {l.title}
            </h1>
            <p style={{ fontSize: '14px', color: textSecondary, margin: 0 }}>{l.subtitle}</p>
          </div>

          {/* REFERRAL LINK CARD */}
          <div style={{ 
  padding: '20px', borderRadius: '16px', 
  border: '1px solid ' + border, marginBottom: '20px',
  background: `linear-gradient(135deg, ${primary}08, ${primary}15)`,
}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Link2 size={18} color={primary} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>{l.referralLink}</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <code style={{ 
                flex: 1, minWidth: '200px', padding: '12px 14px', borderRadius: '10px', 
                fontSize: '12px', fontFamily: 'monospace',
                background: 'var(--background)', color: primary, 
                wordBreak: 'break-all', border: '1px solid ' + border,
                minHeight: '44px', display: 'flex', alignItems: 'center',
              }}>
                {refLink}
              </code>
              <button 
                onClick={handleCopy}
                style={{
                  padding: '12px 18px', borderRadius: '10px', border: 'none',
                  background: copied ? '#10b981' : primary, color: '#fff',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  minHeight: '44px', whiteSpace: 'nowrap',
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? l.copied : l.copy}
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '12px', marginBottom: '20px' 
          }}>
            {[
              { icon: DollarSign, label: l.totalEarnings, value: `$${(affiliate?.total_earnings || 0).toFixed(2)}`, color: '#10b981' },
              { icon: Users, label: l.referrals, value: affiliate?.total_referrals || 0, color: '#3b82f6' },
              { icon: Wallet, label: l.availableBalance, value: `$${(affiliate?.available_balance || 0).toFixed(2)}`, color: '#8b5cf6' },
              { icon: Clock, label: l.pending, value: `$${(affiliate?.pending_balance || 0).toFixed(2)}`, color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} style={{ 
                padding: '16px', background: surface, borderRadius: '12px', 
                border: '1px solid ' + border,
              }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '10px', 
                  background: `${stat.color}15`, display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', marginBottom: '10px',
                }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: textSecondary, marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* PAYOUT REQUEST */}
          <div style={{ 
            padding: '16px', background: surface, borderRadius: '12px', 
            border: '1px solid ' + border, marginBottom: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: '0 0 4px' }}>
                💰 {l.requestPayout}
              </h3>
              <p style={{ fontSize: '12px', color: textSecondary, margin: 0 }}>{l.minPayout}</p>
            </div>
            <button
              disabled={(affiliate?.available_balance || 0) < 10}
              style={{
                padding: '12px 24px', borderRadius: '10px', border: 'none',
                background: (affiliate?.available_balance || 0) >= 10 ? '#10b981' : border,
                color: (affiliate?.available_balance || 0) >= 10 ? '#fff' : textSecondary,
                fontSize: '13px', fontWeight: 600, cursor: (affiliate?.available_balance || 0) >= 10 ? 'pointer' : 'not-allowed',
                minHeight: '44px',
              }}
            >
              {l.requestPayout}
            </button>
          </div>

          {/* SHARE BUTTONS */}
          <div style={{ padding: '16px', background: surface, borderRadius: '12px', border: '1px solid ' + border, marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Share2 size={16} color={primary} /> {l.shareVia}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {[
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
                { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
                { id: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2' },
                { id: 'email', label: 'Email', icon: Mail, color: '#6B7280' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleShare(s.id)}
                  style={{
                    padding: '12px 16px', borderRadius: '10px', 
                    border: '1px solid ' + border, background: 'transparent',
                    color: textPrimary, fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', gap: '6px', minHeight: '44px',
                  }}
                >
                  <s.icon size={16} color={s.color} /> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* EARNINGS CHART (Last 30 Days) */}
          <div style={{ padding: '16px', background: surface, borderRadius: '12px', border: '1px solid ' + border, marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} color={primary} /> {l.earningsChart}
            </h3>
            {/* Simple bar chart placeholder */}
            <div style={{ 
              display: 'flex', alignItems: 'flex-end', gap: '4px', 
              height: '100px', padding: '8px', 
              background: 'var(--background)', borderRadius: '8px',
            }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const height = Math.random() * 80 + 5; // Mock data
                return (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      height: `${height}%`,
                      background: `linear-gradient(to top, ${primary}, ${primary}80)`,
                      borderRadius: '2px',
                      minWidth: '4px',
                    }} 
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '10px', color: textSecondary }}>30 days ago</span>
              <span style={{ fontSize: '10px', color: textSecondary }}>Today</span>
            </div>
          </div>

          {/* REFERRAL LIST */}
          <div style={{ padding: '16px', background: surface, borderRadius: '12px', border: '1px solid ' + border, marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color={primary} /> {l.referralList}
            </h3>
            {referrals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: textSecondary }}>
                <Users size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
                <p style={{ fontSize: '13px', margin: '0 0 4px' }}>{l.noReferrals}</p>
                <p style={{ fontSize: '11px', margin: 0 }}>{l.noReferralsDesc}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {referrals.map((ref, i) => (
                  <div key={i} style={{ 
                    padding: '12px', borderRadius: '8px', 
                    background: 'var(--background)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{ref.name}</div>
                      <div style={{ fontSize: '11px', color: textSecondary }}>{ref.joined}</div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>+${ref.earned}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HOW IT WORKS */}
          <div style={{ padding: '16px', background: surface, borderRadius: '12px', border: '1px solid ' + border }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color={primary} /> {l.howItWorks}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { step: 1, text: l.step1, icon: Share2, color: '#3b82f6' },
                { step: 2, text: l.step2, icon: Users, color: '#8b5cf6' },
                { step: 3, text: l.step3, icon: DollarSign, color: '#10b981' },
              ].map((item) => (
                <div key={item.step} style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `${item.color}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
                  }}>
                    <item.icon size={22} color={item.color} />
                  </div>
                  <div style={{ 
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: item.color, color: '#fff', fontSize: '11px',
                    fontWeight: 700, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 8px',
                  }}>
                    {item.step}
                  </div>
                  <p style={{ fontSize: '12px', color: textPrimary, margin: 0, lineHeight: 1.4 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}