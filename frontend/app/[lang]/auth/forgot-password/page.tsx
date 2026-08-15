'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const cardBg = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  const labels: Record<string, any> = {
    en: { title: 'Forgot Password', subtitle: 'Enter your email for a reset link', email: 'Email', send: 'Send Reset Link', sent: 'Check your email!', sentMsg: 'Reset link sent to', back: 'Back to Sign In', error: 'User not found' },
    ur: { title: 'پاسورڈ بھول گئے', subtitle: 'ری سیٹ لنک کے لیے ای میل درج کریں', email: 'ای میل', send: 'ری سیٹ لنک بھیجیں', sent: 'ای میل چیک کریں!', sentMsg: 'ری سیٹ لنک بھیجا گیا', back: 'واپس', error: 'صارف نہیں ملا' },
    hi: { title: 'पासवर्ड भूल गए', subtitle: 'रीसेट लिंक के लिए ईमेल दर्ज करें', email: 'ईमेल', send: 'रीसेट लिंक भेजें', sent: 'ईमेल चेक करें!', sentMsg: 'रीसेट लिंक भेज दिया', back: 'वापस', error: 'उपयोगकर्ता नहीं मिला' },
    ar: { title: 'نسيت كلمة المرور', subtitle: 'أدخل بريدك للحصول على رابط', email: 'البريد', send: 'إرسال', sent: 'تحقق من بريدك!', sentMsg: 'تم الإرسال إلى', back: 'العودة', error: 'المستخدم غير موجود' },
  };
  const l = labels[lang] || labels.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(data.message || l.error);
    } catch { setError(l.error); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: cardBg, borderRadius: '20px', padding: '40px 32px', border: `1px solid ${border}`, boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.4)' : '0 4px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: `linear-gradient(135deg, #f59e0b, #ef4444)`, borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Send size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, margin: '0 0 6px' }}>{l.title}</h1>
          <p style={{ fontSize: '14px', color: textSecondary, margin: 0 }}>{l.subtitle}</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '12px' }} />
            <p style={{ color: textPrimary, fontWeight: 600, marginBottom: '8px' }}>{l.sent}</p>
            <p style={{ color: textSecondary, fontSize: '14px' }}>{l.sentMsg}: {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div style={{ padding: '12px', background: isDarkMode?'#7f1d1d20':'#fef2f2', border:'1px solid #ef4444', borderRadius:'10px', color:'#ef4444', fontSize:'13px', marginBottom:'20px', textAlign:'center' }}>{error}</div>}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: textSecondary, marginBottom: '6px', display: 'block' }}>{l.email}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 44px', fontSize: '15px', borderRadius: '12px', border: `1.5px solid ${border}`, backgroundColor: bg, color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: '12px', cursor: loading?'not-allowed':'pointer', opacity: loading?0.7:1, fontFamily }}>
              {loading ? '⏳ Sending...' : l.send}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href={`/${lang}/auth/signin`} style={{ fontSize: '14px', color: primary, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} /> {l.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
