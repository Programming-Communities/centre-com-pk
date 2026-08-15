'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';



export default function SignInPage() {
  const { lang } = useParams() as { lang: string };
  const router = useRouter();
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
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
    en: { title: 'Sign In', subtitle: 'Enter your credentials', email: 'Email address', password: 'Password', signin: 'Sign In', forgot: 'Forgot password?', noAccount: "Don't have an account?", signup: 'Create one', otpTitle: 'Enter OTP', otpSent: 'OTP sent to', otpPlaceholder: '6-digit code', verify: 'Verify & Login', back: '← Back', error: 'Invalid credentials' },
    ur: { title: 'سائن ان', subtitle: 'تفصیلات درج کریں', email: 'ای میل', password: 'پاسورڈ', signin: 'سائن ان', forgot: 'پاسورڈ بھول گئے؟', noAccount: 'اکاؤنٹ نہیں؟', signup: 'بنائیں', otpTitle: 'OTP درج کریں', otpSent: 'OTP بھیجا', otpPlaceholder: '6 ہندسے', verify: 'تصدیق', back: '← واپس', error: 'غلط معلومات' },
    hi: { title: 'साइन इन', subtitle: 'विवरण दर्ज करें', email: 'ईमेल', password: 'पासवर्ड', signin: 'साइन इन', forgot: 'पासवर्ड भूल गए?', noAccount: 'खाता नहीं?', signup: 'बनाएं', otpTitle: 'OTP दर्ज करें', otpSent: 'OTP भेजा', otpPlaceholder: '6 अंक', verify: 'सत्यापित', back: '← वापस', error: 'गलत जानकारी' },
    ar: { title: 'تسجيل الدخول', subtitle: 'أدخل بياناتك', email: 'البريد', password: 'كلمة المرور', signin: 'دخول', forgot: 'نسيت؟', noAccount: 'لا حساب؟', signup: 'أنشئ', otpTitle: 'أدخل OTP', otpSent: 'OTP أُرسل', otpPlaceholder: '6 أرقام', verify: 'تحقق', back: '← رجوع', error: 'بيانات خاطئة' },
  };
  const l = labels[lang] || labels.en;

  const isAdmin = false; // Admin check via DB role

  // STEP 1: Email + Password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      const res = await fetch('/api/auth/local/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        // Admin → OTP step
        if (isAdmin) {
          // Send OTP
          const otpRes = await fetch('/api/auth/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), lang }),
          });
          const otpData = await otpRes.json();
          if (otpData.success) {
            setStep('otp');
          } else {
            setError('Failed to send OTP');
          }
        } else {
          // Normal user → direct login
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role === 'admin' || userData.role === 'super_admin') {
          router.push(`/${lang}/admin`);
        } else {
          router.push(`/${lang}/dashboard`);
        }
        }
      } else {
        setError(data.message || l.error);
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  // STEP 2: OTP verify (admin only)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: otp }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        if (userData.role === 'admin' || userData.role === 'super_admin') {
          router.push(`/${lang}/admin`);
        } else {
          router.push(`/${lang}/dashboard`);
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch { setError('Error'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {step === 'otp' ? (
          /* ========== OTP STEP ========== */
          <>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#10b981', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Shield size={28} color="#fff" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, margin: '0 0 6px' }}>{l.otpTitle}</h1>
              <p style={{ fontSize: '14px', color: textSecondary, margin: 0 }}>{l.otpSent}: <strong style={{ color: primary }}>{email}</strong></p>
            </div>
            {error && <div style={{ padding: '12px 16px', background: isDarkMode?'#7f1d1d20':'#fef2f2', borderRadius:'8px', color:'#ef4444', fontSize:'13px', marginBottom:'16px', borderLeft:'3px solid #ef4444' }}>{error}</div>}
            <form onSubmit={handleVerifyOTP}>
              <input type="text" required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" maxLength={6}
                style={{ width: '100%', padding: '13px 14px', fontSize: '24px', fontWeight: 700, textAlign: 'center', letterSpacing: '8px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily, marginBottom: '20px' }} />
              <button type="submit" disabled={loading || otp.length !== 6}
                style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600, color: '#fff', background: '#10b981', border: 'none', borderRadius: '8px', cursor: (loading||otp.length!==6)?'not-allowed':'pointer', opacity: (loading||otp.length!==6)?0.7:1, fontFamily }}>
                {loading ? 'Verifying...' : l.verify}
              </button>
              <p style={{ textAlign: 'center', marginTop: '12px' }}>
                <button type="button" onClick={() => { setStep('login'); setOtp(''); setError(''); }} style={{ background:'none', border:'none', color: textSecondary, cursor:'pointer', fontSize:'13px' }}>{l.back}</button>
              </p>
            </form>
          </>
        ) : (
          /* ========== LOGIN STEP ========== */
          <>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: `linear-gradient(135deg, ${primary}, ${themeColors.secondary || '#7c3aed'})`, borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Shield size={28} color="#fff" />
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, color: textPrimary, margin: '0 0 6px' }}>{l.title}</h1>
              <p style={{ fontSize: '15px', color: textSecondary, margin: 0 }}>{l.subtitle}</p>
            </div>

            {error && <div style={{ padding: '12px 16px', background: isDarkMode?'#7f1d1d20':'#fef2f2', borderRadius:'8px', color:'#ef4444', fontSize:'13px', marginBottom:'16px', borderLeft:'3px solid #ef4444' }}>{error}</div>}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.email}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, opacity: 0.6 }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    style={{ width: '100%', padding: '13px 14px 13px 40px', fontSize: '15px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.password}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, opacity: 0.6 }} />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    style={{ width: '100%', padding: '13px 48px 13px 40px', fontSize: '15px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: '4px' }}>
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <Link href={`/${lang}/auth/forgot-password`} style={{ fontSize: '13px', color: primary, textDecoration: 'none', fontWeight: 500 }}>{l.forgot}</Link>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600, color: '#fff', background: primary, border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily }}>
                {loading ? 'Please wait...' : l.signin}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: textSecondary }}>
          {l.noAccount}{' '}
          <Link href={`/${lang}/auth/signup`} style={{ color: primary, fontWeight: 600, textDecoration: 'none' }}>{l.signup}</Link>
        </p>
      </div>
    </div>
  );
}
