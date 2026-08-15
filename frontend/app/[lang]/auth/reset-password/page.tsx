'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const { lang } = useParams() as { lang: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const borderColor = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  const labels: Record<string, any> = {
    en: { title: 'Reset Password', subtitle: 'Enter your new password', password: 'New Password', confirm: 'Confirm Password', reset: 'Reset Password', done: 'Password Reset!', doneMsg: 'Redirecting to sign in...', back: 'Back to Sign In', error: 'Invalid or expired token', mismatch: 'Passwords do not match' },
    ur: { title: 'پاسورڈ ری سیٹ', subtitle: 'نیا پاسورڈ درج کریں', password: 'نیا پاسورڈ', confirm: 'تصدیق کریں', reset: 'ری سیٹ کریں', done: 'پاسورڈ ری سیٹ!', doneMsg: 'سائن ان پر ری ڈائریکٹ...', back: 'واپس', error: 'غلط یا میعاد ختم', mismatch: 'پاسورڈ میچ نہیں' },
    hi: { title: 'पासवर्ड रीसेट', subtitle: 'नया पासवर्ड दर्ज करें', password: 'नया पासवर्ड', confirm: 'पुष्टि करें', reset: 'रीसेट करें', done: 'पासवर्ड रीसेट!', doneMsg: 'साइन इन पर...', back: 'वापस', error: 'अमान्य टोकन', mismatch: 'पासवर्ड मेल नहीं' },
    ar: { title: 'إعادة تعيين', subtitle: 'أدخل كلمة مرور جديدة', password: 'كلمة مرور جديدة', confirm: 'تأكيد', reset: 'تعيين', done: 'تم!', doneMsg: 'جاري التحويل...', back: 'العودة', error: 'رابط غير صالح', mismatch: 'كلمة المرور غير متطابقة' },
  };
  const l = labels[lang] || labels.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError(l.error); return; }
    if (password !== confirmPassword) { setError(l.mismatch); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setTimeout(() => router.push('/' + lang + '/auth/signin'), 2000);
      } else setError(data.message || l.error);
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <KeyRound size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, margin: '0 0 6px' }}>{l.title}</h1>
          <p style={{ fontSize: '15px', color: textSecondary, margin: 0 }}>{l.subtitle}</p>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '30px', background: isDarkMode ? '#064e3b20' : '#f0fdf4', borderRadius: '12px', border: '1px solid #10b981' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '12px' }} />
            <p style={{ color: textPrimary, fontWeight: 600, fontSize: '16px' }}>{l.done}</p>
            <p style={{ color: textSecondary, fontSize: '14px' }}>{l.doneMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div style={{ padding: '12px 16px', background: isDarkMode ? '#7f1d1d20' : '#fef2f2', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '20px', borderLeft: '3px solid #ef4444' }}>{error}</div>}
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.password}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, opacity: 0.6 }} />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ width: '100%', padding: '13px 48px 13px 40px', fontSize: '15px', borderRadius: '8px', border: '1.5px solid ' + borderColor, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: '4px' }}>
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.confirm}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, opacity: 0.6 }} />
                <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  style={{ width: '100%', padding: '13px 48px 13px 40px', fontSize: '15px', borderRadius: '8px', border: '1.5px solid ' + borderColor, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily }}>
              {loading ? 'Resetting...' : l.reset}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href={'/' + lang + '/auth/signin'} style={{ fontSize: '14px', color: primary, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} /> {l.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
