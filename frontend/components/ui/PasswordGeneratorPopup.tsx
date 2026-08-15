'use client';
import { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, Check, Shield, Key } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface PasswordGeneratorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (password: string) => void;
  lang: string;
}

export default function PasswordGeneratorPopup({ isOpen, onClose, onSelect, lang }: PasswordGeneratorPopupProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const labels: Record<string, any> = {
    en: { title: 'Password Generator', length: 'Length', uppercase: 'Uppercase', lowercase: 'Lowercase', numbers: 'Numbers', symbols: 'Symbols', generate: 'Generate', copy: 'Copy', use: 'Use Password', strength: 'Strength', strong: 'Strong', medium: 'Medium', weak: 'Weak' },
    ur: { title: 'پاسورڈ جنریٹر', length: 'لمبائی', uppercase: 'بڑے حروف', lowercase: 'چھوٹے حروف', numbers: 'اعداد', symbols: 'علامات', generate: 'بنائیں', copy: 'کاپی', use: 'استعمال کریں', strength: 'مضبوطی', strong: 'مضبوط', medium: 'درمیانہ', weak: 'کمزور' },
    hi: { title: 'पासवर्ड जनरेटर', length: 'लंबाई', uppercase: 'बड़े अक्षर', lowercase: 'छोटे अक्षर', numbers: 'संख्या', symbols: 'चिह्न', generate: 'बनाएं', copy: 'कॉपी', use: 'उपयोग करें', strength: 'मजबूती', strong: 'मजबूत', medium: 'मध्यम', weak: 'कमजोर' },
    ar: { title: 'مولد كلمة المرور', length: 'الطول', uppercase: 'أحرف كبيرة', lowercase: 'أحرف صغيرة', numbers: 'أرقام', symbols: 'رموز', generate: 'توليد', copy: 'نسخ', use: 'استخدام', strength: 'القوة', strong: 'قوي', medium: 'متوسط', weak: 'ضعيف' },
  };

  const l = labels[lang] || labels.en;
  const isRTL = lang === 'ur' || lang === 'ar';

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;
    
    if (!chars) chars = lower + nums;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
    setCopied(false);
  };

  const getStrength = (): { label: string; color: string; width: string } => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (options.uppercase) score++;
    if (options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    
    if (score >= 5) return { label: l.strong, color: '#10b981', width: '100%' };
    if (score >= 3) return { label: l.medium, color: '#f59e0b', width: '60%' };
    return { label: l.weak, color: '#ef4444', width: '30%' };
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => { if (isOpen) generatePassword(); }, [isOpen, length, options]);

  if (!isOpen) return null;

  const strength = getStrength();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: themeColors.background,
        borderRadius: '16px', padding: '30px', maxWidth: '420px', width: '90%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        direction: isRTL ? 'rtl' : 'ltr',
        border: `1px solid ${themeColors.border}`
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: '10px', padding: '8px' }}>
              <Key size={20} color="white" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: themeColors.text?.primary, margin: 0 }}>{l.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: themeColors.text?.secondary, padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Password Display */}
        <div style={{
          backgroundColor: themeColors.surface,
          borderRadius: '10px', padding: '14px 16px',
          border: `1px solid ${themeColors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px', fontFamily: 'monospace', fontSize: '18px',
          letterSpacing: '1px', wordBreak: 'break-all'
        }}>
          <span style={{ color: themeColors.text?.primary }}>{password}</span>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button onClick={copyPassword} title={l.copy} style={{
              background: copied ? '#10b981' : 'transparent', border: 'none',
              cursor: 'pointer', padding: '6px', borderRadius: '6px', color: copied ? 'white' : themeColors.text?.secondary
            }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button onClick={generatePassword} title={l.generate} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '6px', borderRadius: '6px', color: themeColors.text?.secondary
            }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Strength Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: themeColors.text?.secondary }}>{l.strength}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: strength.color }}>{strength.label}</span>
          </div>
          <div style={{ height: '4px', backgroundColor: themeColors.border, borderRadius: '2px' }}>
            <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, borderRadius: '2px', transition: 'all 0.3s' }} />
          </div>
        </div>

        {/* Length Slider */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: themeColors.text?.secondary }}>{l.length}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: themeColors.primary }}>{length}</span>
          </div>
          <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '100%', accentColor: themeColors.primary, cursor: 'pointer' }} />
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {(['uppercase', 'lowercase', 'numbers', 'symbols'] as const).map((key) => (
            <label key={key} style={{
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
              color: themeColors.text?.primary, cursor: 'pointer',
              padding: '8px 12px', borderRadius: '8px',
              backgroundColor: options[key] ? `${themeColors.primary}15` : themeColors.surface,
              border: `1px solid ${options[key] ? themeColors.primary : themeColors.border}`
            }}>
              <input type="checkbox" checked={options[key]} onChange={() => setOptions({ ...options, [key]: !options[key] })}
                style={{ accentColor: themeColors.primary }} />
              {l[key]}
            </label>
          ))}
        </div>

        {/* Use Password Button */}
        <button onClick={() => { onSelect(password); onClose(); }} style={{
          width: '100%', padding: '12px', fontSize: '15px', fontWeight: 700,
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#ffffff',
          border: 'none', borderRadius: '10px', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(37,99,235,0.3)'
        }}>
          <Shield size={16} style={{ marginRight: '6px', display: 'inline' }} />
          {l.use}
        </button>
      </div>
    </div>
  );
}
