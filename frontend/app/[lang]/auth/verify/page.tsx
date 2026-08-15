'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const { lang } = useParams() as { lang: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token provided'); return; }
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) { setStatus('success'); setMessage(data.message || 'Email verified!'); }
        else { setStatus('error'); setMessage(data.message || 'Verification failed'); }
      })
      .catch(() => { setStatus('error'); setMessage('Something went wrong'); });
  }, [token]);

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');

  const labels: Record<string, any> = {
    en: { verifying: 'Verifying your email...', success: 'Email Verified!', successMsg: 'Your email has been verified. You can now sign in.', error: 'Verification Failed', signin: 'Go to Sign In', home: 'Go Home' },
    ur: { verifying: 'ای میل تصدیق ہو رہی ہے...', success: 'ای میل تصدیق شدہ!', successMsg: 'آپ کی ای میل تصدیق ہو گئی ہے۔ اب آپ سائن ان کر سکتے ہیں۔', error: 'تصدیق ناکام', signin: 'سائن ان کریں', home: 'ہوم' },
    hi: { verifying: 'ईमेल सत्यापित हो रहा है...', success: 'ईमेल सत्यापित!', successMsg: 'आपका ईमेल सत्यापित हो गया है। अब आप साइन इन कर सकते हैं।', error: 'सत्यापन विफल', signin: 'साइन इन करें', home: 'होम' },
    ar: { verifying: 'جاري التحقق...', success: 'تم التحقق!', successMsg: 'تم التحقق من بريدك. يمكنك الآن تسجيل الدخول.', error: 'فشل التحقق', signin: 'تسجيل الدخول', home: 'الرئيسية' },
  };
  const l = labels[lang] || labels.en;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        {status === 'loading' && (
          <div>
            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#3b82f6', marginBottom: '16px' }} />
            <p style={{ color: textPrimary, fontSize: '16px' }}>{l.verifying}</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <CheckCircle size={56} color="#10b981" style={{ marginBottom: '16px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>{l.success}</h1>
            <p style={{ color: textSecondary, marginBottom: '24px' }}>{l.successMsg}</p>
            <Link href={`/${lang}/auth/signin`} style={{ padding: '12px 32px', background: '#10b981', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>{l.signin}</Link>
          </div>
        )}
        {status === 'error' && (
          <div>
            <XCircle size={56} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>{l.error}</h1>
            <p style={{ color: textSecondary, marginBottom: '24px' }}>{message}</p>
            <Link href={`/${lang}`} style={{ padding: '12px 32px', background: '#3b82f6', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>{l.home}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
