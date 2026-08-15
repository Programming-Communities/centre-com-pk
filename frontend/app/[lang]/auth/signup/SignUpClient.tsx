"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, AtSign } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function SignUpClient({ lang }: { lang: string }) {
  const router = useRouter();
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const isRTL = lang === "ur" || lang === "ar";
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const t: Record<string, any> = {
    en: {
      title: "Create Your Account", subtitle: "Join Centre.com.pk — 100% free",
      firstName: "First Name", firstNamePlaceholder: "Enter first name",
      lastName: "Last Name", lastNamePlaceholder: "Enter last name",
      username: "Username", usernamePlaceholder: "Choose a username (optional)",
      email: "Email Address", emailPlaceholder: "Enter your email",
      password: "Password", passwordPlaceholder: "Min 6 characters",
      signUp: "Create Account", signingUp: "Creating Account...",
      haveAccount: "Already have an account?", signIn: "Sign In",
      nameRequired: "First & Last name required",
      emailRequired: "Valid email is required",
      passwordRequired: "Password must be at least 6 characters",
      successMsg: "Account created! Logging you in...",
      errorGeneric: "Something went wrong. Please try again.",
    },
    ur: {
      title: "اپنا اکاؤنٹ بنائیں", subtitle: "Centre.com.pk میں شامل ہوں",
      firstName: "پہلا نام", firstNamePlaceholder: "پہلا نام درج کریں",
      lastName: "آخری نام", lastNamePlaceholder: "آخری نام درج کریں",
      username: "صارف نام", usernamePlaceholder: "صارف نام منتخب کریں",
      email: "ای میل", emailPlaceholder: "ای میل درج کریں",
      password: "پاس ورڈ", passwordPlaceholder: "کم از کم 6 حروف",
      signUp: "اکاؤنٹ بنائیں", signingUp: "اکاؤنٹ بن رہا ہے...",
      haveAccount: "پہلے سے اکاؤنٹ ہے؟", signIn: "سائن ان",
      nameRequired: "پہلا اور آخری نام درکار ہے",
      emailRequired: "درست ای میل درکار ہے",
      passwordRequired: "پاس ورڈ کم از کم 6 حروف کا ہو",
      successMsg: "اکاؤنٹ بن گیا! لاگ ان ہو رہے ہیں...",
      errorGeneric: "کچھ غلط ہو گیا۔",
    },
    hi: {
      title: "अपना खाता बनाएं", subtitle: "Centre.com.pk से जुड़ें",
      firstName: "पहला नाम", firstNamePlaceholder: "पहला नाम दर्ज करें",
      lastName: "अंतिम नाम", lastNamePlaceholder: "अंतिम नाम दर्ज करें",
      username: "उपयोगकर्ता नाम", usernamePlaceholder: "उपयोगकर्ता नाम चुनें",
      email: "ईमेल", emailPlaceholder: "ईमेल दर्ज करें",
      password: "पासवर्ड", passwordPlaceholder: "कम से कम 6 अक्षर",
      signUp: "खाता बनाएं", signingUp: "खाता बन रहा है...",
      haveAccount: "खाता है?", signIn: "साइन इन",
      nameRequired: "पहला और अंतिम नाम आवश्यक",
      emailRequired: "वैध ईमेल आवश्यक",
      passwordRequired: "पासवर्ड 6 अक्षर का हो",
      successMsg: "खाता बन गया!",
      errorGeneric: "कुछ गलत हुआ।",
    },
    ar: {
      title: "إنشاء حساب", subtitle: "انضم إلى Centre.com.pk",
      firstName: "الاسم الأول", firstNamePlaceholder: "أدخل الاسم الأول",
      lastName: "الاسم الأخير", lastNamePlaceholder: "أدخل الاسم الأخير",
      username: "اسم المستخدم", usernamePlaceholder: "اختر اسم مستخدم",
      email: "البريد", emailPlaceholder: "أدخل البريد",
      password: "كلمة المرور", passwordPlaceholder: "6 أحرف على الأقل",
      signUp: "إنشاء", signingUp: "جاري...",
      haveAccount: "لديك حساب؟", signIn: "دخول",
      nameRequired: "الاسم الأول والأخير مطلوب",
      emailRequired: "بريد صحيح مطلوب",
      passwordRequired: "كلمة مرور 6 أحرف",
      successMsg: "تم الإنشاء!",
      errorGeneric: "حدث خطأ.",
    },
  };

  const text = t[lang] || t.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName) { setError(text.nameRequired); return; }
    if (!email || !email.includes("@")) { setError(text.emailRequired); return; }
    if (!password || password.length < 6) { setError(text.passwordRequired); return; }

    setLoading(true);
    try {
      const name = firstName + " " + lastName;
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, username: username || undefined }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(text.successMsg);
        // Auto-login
        const loginRes = await fetch("/api/auth/local/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          localStorage.setItem("auth_token", loginData.token);
          localStorage.setItem("user_data", JSON.stringify(loginData.user));
          setTimeout(() => {
            if (loginData.user.role === "admin") router.push("/" + lang + "/admin/dashboard");
            else router.push("/" + lang + "/dashboard");
          }, 500);
        } else {
          setTimeout(() => router.push("/" + lang + "/auth/signin"), 1000);
        }
      } else {
        setError(data.error || text.errorGeneric);
      }
    } catch {
      setError(text.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const inputClass = `w-full py-3 border rounded-xl outline-none transition focus:ring-2 text-base`;
  const labelClass = "text-sm font-medium mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "var(--background)", fontFamily, direction: isRTL ? "rtl" : "ltr" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={"/" + lang} className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Centre.com.pk</h1>
          </Link>
          <h2 className="text-2xl font-bold mt-4" style={{ color: "var(--text-primary)" }}>{text.title}</h2>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>{text.subtitle}</p>
        </div>

        <div className="rounded-2xl shadow-xl border p-6 sm:p-8" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-start gap-3" style={{ backgroundColor: isDarkMode ? "rgba(220,38,38,0.15)" : "#fef2f2" }}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "var(--error)" }} />
              <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl flex items-start gap-3" style={{ backgroundColor: isDarkMode ? "rgba(5,150,105,0.15)" : "#f0fdf4" }}>
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "var(--success)" }} />
              <p className="text-sm" style={{ color: "var(--success)" }}>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name + Last Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={{ color: "var(--text-secondary)" }}>{text.firstName}</label>
                <div className="relative">
                  <User className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4`} style={{ color: "var(--text-secondary)" }} />
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={text.firstNamePlaceholder}
                    className={`${inputClass} ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"}`}
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--text-secondary)" }}>{text.lastName}</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder={text.lastNamePlaceholder}
                  className={`${inputClass} px-3`}
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className={labelClass} style={{ color: "var(--text-secondary)" }}>{text.username}</label>
              <div className="relative">
                <AtSign className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4`} style={{ color: "var(--text-secondary)" }} />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={text.usernamePlaceholder}
                  className={`${inputClass} ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"}`}
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass} style={{ color: "var(--text-secondary)" }}>{text.email}</label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4`} style={{ color: "var(--text-secondary)" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={text.emailPlaceholder}
                  className={`${inputClass} ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"}`}
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass} style={{ color: "var(--text-secondary)" }}>{text.password}</label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4`} style={{ color: "var(--text-secondary)" }} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={text.passwordPlaceholder}
                  className={`${inputClass} ${isRTL ? "pr-10 pl-10" : "pl-10 pr-10"}`}
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`} style={{ color: "var(--text-secondary)" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 text-white rounded-xl font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2 text-base"
              style={{ backgroundColor: "var(--primary)" }}>
              {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{text.signingUp}</> : text.signUp}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {text.haveAccount}{" "}
              <Link href={"/" + lang + "/auth/signin"} style={{ color: "var(--primary)", fontWeight: 600 }}>{text.signIn}</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6 opacity-60" style={{ color: "var(--text-secondary)" }}>
          © {new Date().getFullYear()} Centre.com.pk — All Free Online Tools
        </p>
      </div>
    </div>
  );
}
