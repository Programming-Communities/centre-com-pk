'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Eye, EyeOff, Lock, Mail, User, AtSign } from 'lucide-react';

export default function SignUpPage() {
  const { lang } = useParams() as { lang: string };
  const router = useRouter();
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const borderColor = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  const labels: Record<string, any> = {
    en: { title: 'Create Account', subtitle: "Join Centre.com.pk — it's free!", firstName: 'First Name', lastName: 'Last Name', username: 'Username', email: 'Email address', password: 'Password', signup: 'Create Account', haveAccount: 'Already have an account?', signin: 'Sign In', checking: 'Checking...', available: 'Available ✓', taken: 'Taken ✗' },
    ur: { title: 'اکاؤنٹ بنائیں', subtitle: 'Centre.com.pk میں شامل ہوں — مفت!', firstName: 'پہلا نام', lastName: 'آخری نام', username: 'صارف نام', email: 'ای میل', password: 'پاسورڈ', signup: 'اکاؤنٹ بنائیں', haveAccount: 'پہلے سے اکاؤنٹ ہے؟', signin: 'سائن ان', checking: 'چیک...', available: 'دستیاب ✓', taken: 'مصروف ✗' },
    hi: { title: 'खाता बनाएं', subtitle: 'Centre.com.pk से जुड़ें — मुफ्त!', firstName: 'पहला नाम', lastName: 'अंतिम नाम', username: 'उपयोगकर्ता नाम', email: 'ईमेल', password: 'पासवर्ड', signup: 'खाता बनाएं', haveAccount: 'पहले से खाता है?', signin: 'साइन इन', checking: 'जाँच...', available: 'उपलब्ध ✓', taken: 'लिया ✗' },
    ar: { title: 'إنشاء حساب', subtitle: 'انضم إلى Centre.com.pk — مجاناً!', firstName: 'الاسم الأول', lastName: 'الاسم الأخير', username: 'اسم المستخدم', email: 'البريد', password: 'كلمة المرور', signup: 'إنشاء', haveAccount: 'لديك حساب؟', signin: 'دخول', checking: 'فحص...', available: 'متاح ✓', taken: 'محجوز ✗' },
  };
  const l = labels[lang] || labels.en;

  const checkUsername = async (value: string) => {
    if (value.length < 3) { setUsernameAvailable(null); return; }
    setCheckingUsername(true);
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(value)}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch { setUsernameAvailable(null); }
    setCheckingUsername(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/local/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), firstName, lastName, username, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Account created! Redirecting...');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setTimeout(() => router.push(`/${lang}/dashboard`), 1500);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', backgroundColor: bg, fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: textPrimary, margin: '0 0 6px' }}>{l.title}</h1>
          <p style={{ fontSize: '15px', color: textSecondary, margin: 0 }}>{l.subtitle}</p>
        </div>

        {success && (
          <div style={{ padding: '14px 18px', background: isDarkMode ? '#064e3b20' : '#f0fdf4', borderRadius: '8px', color: '#10b981', fontSize: '14px', marginBottom: '20px', borderLeft: '3px solid #10b981', textAlign: 'center' }}>{success}</div>
        )}
        {error && (
          <div style={{ padding: '12px 16px', background: isDarkMode ? '#7f1d1d20' : '#fef2f2', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '20px', borderLeft: '3px solid #ef4444' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* First Name + Last Name */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.firstName} *</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Aamir"
                style={{ width: '100%', padding: '13px 14px', fontSize: '15px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.lastName} *</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ali"
                style={{ width: '100%', padding: '13px 14px', fontSize: '15px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
            </div>
          </div>

          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.username} *</label>
            <div style={{ position: 'relative' }}>
              <AtSign size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, opacity: 0.6 }} />
              <input type="text" required value={username} onChange={e => { setUsername(e.target.value); checkUsername(e.target.value); }} placeholder="aamirali"
                style={{ width: '100%', padding: '13px 95px 13px 40px', fontSize: '15px', borderRadius: '8px', border: `1.5px solid ${usernameAvailable === false ? '#ef4444' : usernameAvailable === true ? '#10b981' : borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontWeight: 600,
                color: checkingUsername ? textSecondary : usernameAvailable === true ? '#10b981' : usernameAvailable === false ? '#ef4444' : textSecondary }}>
                {checkingUsername ? l.checking : usernameAvailable === true ? l.available : usernameAvailable === false ? l.taken : ''}
              </span>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.email} *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, opacity: 0.6 }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: '100%', padding: '13px 14px 13px 40px', fontSize: '15px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, backgroundColor: 'transparent', color: textPrimary, outline: 'none', boxSizing: 'border-box', fontFamily }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '6px', display: 'block' }}>{l.password} *</label>
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

          <button type="submit" disabled={loading || usernameAvailable === false}
            style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600, color: '#fff', background: primary, border: 'none', borderRadius: '8px', cursor: (loading || usernameAvailable === false) ? 'not-allowed' : 'pointer', opacity: (loading || usernameAvailable === false) ? 0.7 : 1, fontFamily }}>
            {loading ? 'Creating...' : l.signup}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: textSecondary }}>
          {l.haveAccount}{' '}
          <Link href={`/${lang}/auth/signin`} style={{ color: primary, fontWeight: 600, textDecoration: 'none' }}>{l.signin}</Link>
        </p>
      </div>
    </div>
  );
}
