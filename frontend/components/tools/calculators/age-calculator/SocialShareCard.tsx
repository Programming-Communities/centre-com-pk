// components/tools/calculators/age-calculator/SocialShareCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, Download, Share2, Copy, Check, 
  MessageCircle, Send, Image, Type, Star,
  Cake, Zap, Settings, Timer,
  Facebook, Twitter, Linkedin, Link2,
  Palette, Smile, Loader2, AlertCircle
} from 'lucide-react';
import { useTheme } from '@/components/theme';

interface AgeData {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  daysUntilBirthday: number;
  zodiacSignKey: string;
  lifePercentage: string;
  formattedNextBirthday: string;
  isBirthdayToday: boolean;
  ageInMonths: number;
  totalWeeks: number;
  totalHours: number;
}

interface SocialShareCardProps {
  ageData: AgeData;
  onClose: () => void;
  isPaidUser?: boolean;
}

const TEMPLATES = [
  { id: 'classic', name: 'Classic', icon: '🎂' },
  { id: 'modern', name: 'Modern', icon: '✨' },
  { id: 'minimal', name: 'Minimal', icon: '🤍' },
  { id: 'bold', name: 'Bold', icon: '🔥' },
];

// Dynamic color presets
const getColorPresets = (primary: string, secondary: string) => [
  { bg: `linear-gradient(135deg, ${primary}, ${secondary})`, name: 'Theme', colors: [primary, secondary] },
  { bg: 'linear-gradient(135deg, #2563eb, #4338ca)', name: 'Ocean', colors: ['#2563eb', '#4338ca'] },
  { bg: 'linear-gradient(135deg, #f97316, #dc2626)', name: 'Sunset', colors: ['#f97316', '#dc2626'] },
  { bg: 'linear-gradient(135deg, #10b981, #0f766e)', name: 'Forest', colors: ['#10b981', '#0f766e'] },
  { bg: 'linear-gradient(135deg, #9333ea, #5b21b6)', name: 'Royal', colors: ['#9333ea', '#5b21b6'] },
  { bg: 'linear-gradient(135deg, #ec4899, #e11d48)', name: 'Rose', colors: ['#ec4899', '#e11d48'] },
  { bg: 'linear-gradient(135deg, #1e293b, #020617)', name: 'Midnight', colors: ['#1e293b', '#020617'] },
  { bg: 'linear-gradient(135deg, #f59e0b, #c2410c)', name: 'Golden', colors: ['#f59e0b', '#c2410c'] },
  { bg: 'linear-gradient(135deg, #06b6d4, #1d4ed8)', name: 'Aqua', colors: ['#06b6d4', '#1d4ed8'] },
];

const BG_PATTERNS = [
  { id: 'solid', name: 'Solid', style: '', size: '' },
  { id: 'dots', name: 'Dots', style: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', size: '20px 20px' },
  { id: 'grid', name: 'Grid', style: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', size: '30px 30px' },
  { id: 'diagonal', name: 'Diagonal', style: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)', size: '' },
];

const ZODIAC_EMOJI_MAP: Record<string, string> = {
  aquarius: '♒', pisces: '♓', aries: '♈', taurus: '♉',
  gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑',
};
const getZodiacEmoji = (key: string): string => ZODIAC_EMOJI_MAP[key] || '⭐';

interface CardSections {
  showEmoji: boolean; showYears: boolean; showMonthsDays: boolean;
  showZodiac: boolean; showTotalDays: boolean; showAgeInMonths: boolean;
  showTotalWeeks: boolean; showTotalHours: boolean; showDaysUntilBirthday: boolean;
  showLifePercentage: boolean; showBirthdayCountdown: boolean;
  showNextBirthdayDate: boolean; showCustomMessage: boolean; showWatermark: boolean;
}

const PLAN_EXPIRY: Record<string, { hours: number; label: string }> = {
  guest: { hours: 24, label: '1 Day' },
  free: { hours: 168, label: '7 Days' },
  pro: { hours: 720, label: '30 Days' },
  premium: { hours: 8760, label: '1 Year' },
  lifetime: { hours: 87600, label: 'Forever' },
};

export default function SocialShareCard({ ageData, onClose, isPaidUser = false }: SocialShareCardProps) {
  const { themeColors } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const COLOR_PRESETS = getColorPresets(themeColors.primary || '#2563eb', themeColors.secondary || '#1d4ed8');
  
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState('🎂');
  const [customMessage, setCustomMessage] = useState('');
  
  const [sections, setSections] = useState<CardSections>({
    showEmoji: true, showYears: true, showMonthsDays: true,
    showZodiac: true, showTotalDays: true, showAgeInMonths: false,
    showTotalWeeks: false, showTotalHours: false, showDaysUntilBirthday: true,
    showLifePercentage: false, showBirthdayCountdown: true,
    showNextBirthdayDate: false, showCustomMessage: false, showWatermark: true,
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'template' | 'colors' | 'background' | 'sections' | 'message'>('template');
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ✅ Token State
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [userPlan, setUserPlan] = useState<string>('guest');
  const [planLabel, setPlanLabel] = useState<string>('1 Day');
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setIsVisible(true));
    const storedPlan = localStorage.getItem('centers_user_plan') || 'guest';
    setUserPlan(storedPlan);
    const planInfo = PLAN_EXPIRY[storedPlan] || PLAN_EXPIRY.guest;
    setPlanLabel(planInfo.label);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.centre.com.pk';
    setShareUrl(`${baseUrl}/tools/calculators/age-calculator`);
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // ✅ Token Expiry Timer
  useEffect(() => {
    if (!tokenExpiry) return;
    const updateTimer = () => {
      const now = new Date();
      const diff = tokenExpiry.getTime() - now.getTime();
      if (diff <= 0) { setTimeRemaining('Expired'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setTimeRemaining(`${d}d ${h}h`);
      else if (h > 0) setTimeRemaining(`${h}h ${m}m`);
      else setTimeRemaining(`${m}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tokenExpiry]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => { setSelectedColor(0); }, [themeColors.primary, themeColors.secondary]);

  const handleClose = () => { setIsVisible(false); setTimeout(onClose, 300); };
  const formatNumber = (num: number) => num.toLocaleString();
  const colorPreset = COLOR_PRESETS[selectedColor];
  const pattern = BG_PATTERNS[selectedPattern];
  const toggleSection = (key: keyof CardSections) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  const visibleExtraSections = Object.entries(sections)
    .filter(([key, value]) => 
      ['showTotalDays', 'showAgeInMonths', 'showTotalWeeks', 'showTotalHours', 
       'showDaysUntilBirthday', 'showLifePercentage'].includes(key) && value
    ).length;

  const hasAnyContent = sections.showYears || sections.showZodiac || sections.showTotalDays || 
    sections.showDaysUntilBirthday || sections.showBirthdayCountdown || visibleExtraSections > 0;

const createShareToken = async (): Promise<string | null> => {
  if (shareToken) return shareUrl;
  
  setIsCreatingToken(true);
  setTokenError(null);
  
  try {
    const userData = localStorage.getItem('centers_user');
    const user = userData ? JSON.parse(userData) : null;
    
    const response = await fetch('/api/token/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardData: {
          userName: user?.name || user?.username || user?.email?.split('@')[0] || 'Anonymous',

          birthDate: `${ageData.years} years ago`,
          years: ageData.years,
          months: ageData.months,
          days: ageData.days,
          totalDays: ageData.totalDays,
          ageInMonths: ageData.ageInMonths,
          totalWeeks: ageData.totalWeeks,
          totalHours: ageData.totalHours,
          daysUntilBirthday: ageData.daysUntilBirthday,
          lifePercentage: ageData.lifePercentage,
          zodiacSignKey: ageData.zodiacSignKey,
          formattedNextBirthday: ageData.formattedNextBirthday,
          isBirthdayToday: ageData.isBirthdayToday,
        },
        sections: sections,
        customization: {
          emoji: selectedEmoji,
          customMessage: customMessage,
          colorTheme: selectedColor,
          bgPattern: selectedPattern,
        },
        userId: user?.id || null, // ✅ User ID pass
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      setShareToken(data.token);
      setShareUrl(data.url);
      setTokenExpiry(new Date(data.expiresAt));
      setUserPlan(data.plan);
      if (data.max) setPlanLabel(`${data.plan} (${data.remaining}/${data.max})`);
      setIsCreatingToken(false);
      return data.url;
    } else {
      setTokenError(data.message || 'Token limit reached');
      setIsCreatingToken(false);
      return null;
    }
  } catch (err) {
    console.error('Token creation error:', err);
    setTokenError('API unavailable, sharing direct link');
    setIsCreatingToken(false);
    return null;
  }
};

  // ✅ SHARE TEXT
  const getShareText = (url?: string) => {
    const shareUrlToUse = url || shareUrl;
    let text = '';
    if (sections.showCustomMessage && customMessage) text = `${customMessage}\n\n`;
    text += `🎂 My Age Results from Centre.com.pk\n\n`;
    if (sections.showYears) {
      text += `🎉 I am ${ageData.years} years old`;
      if (sections.showMonthsDays) text += ` (${ageData.months} months & ${ageData.days} days)`;
      text += `!\n`;
    }
    if (sections.showZodiac) text += `♈ Zodiac Sign: ${ageData.zodiacSignKey.toUpperCase()}\n`;
    if (sections.showTotalDays) text += `📅 Total days lived: ${formatNumber(ageData.totalDays)}\n`;
    if (sections.showDaysUntilBirthday && !ageData.isBirthdayToday) text += `🎂 Days until next birthday: ${ageData.daysUntilBirthday}\n`;
    if (ageData.isBirthdayToday) text = `🎂🎉 TODAY IS MY BIRTHDAY! 🎉🎂\n\n${text}`;
    text += `\n🔗 ${shareUrlToUse}`;
    if (userPlan === 'guest') text += `\n\n💡 Sign up FREE for 7-day share links!`;
    return text;
  };

  // ✅ HANDLE SHARE — Creates token, then shares
  const handleShare = async (platform: string) => {
    let shareUrlToUse = shareUrl;
    
    // Create token if not exists
    const tokenUrl = await createShareToken();
    if (tokenUrl) shareUrlToUse = tokenUrl;
    
    const text = getShareText(shareUrlToUse);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrlToUse)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrlToUse)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrlToUse)}&text=${encodeURIComponent(text)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=500');
  };

  // ✅ COPY TEXT
  const handleCopy = async () => {
    let shareUrlToUse = shareUrl;
    const tokenUrl = await createShareToken();
    if (tokenUrl) shareUrlToUse = tokenUrl;
    
    await navigator.clipboard.writeText(getShareText(shareUrlToUse));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ COPY LINK
  const handleCopyLink = async () => {
    let shareUrlToUse = shareUrl;
    const tokenUrl = await createShareToken();
    if (tokenUrl) shareUrlToUse = tokenUrl;
    
    await navigator.clipboard.writeText(shareUrlToUse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ DOWNLOAD PNG
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.scale(2, 2);
      
      const radius = 16;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(rect.width - radius, 0);
      ctx.quadraticCurveTo(rect.width, 0, rect.width, radius);
      ctx.lineTo(rect.width, rect.height - radius);
      ctx.quadraticCurveTo(rect.width, rect.height, rect.width - radius, rect.height);
      ctx.lineTo(radius, rect.height);
      ctx.quadraticCurveTo(0, rect.height, 0, rect.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();
      
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, colorPreset.colors[0]);
      gradient.addColorStop(1, colorPreset.colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      let y = 40;
      if (sections.showEmoji || sections.showZodiac) {
        if (sections.showEmoji) { ctx.font = '32px Arial'; ctx.fillStyle = '#fff'; ctx.fillText(selectedEmoji, 30, y + 25); }
        if (sections.showZodiac) { ctx.font = 'bold 14px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText(`${getZodiacEmoji(ageData.zodiacSignKey)} ${ageData.zodiacSignKey.toUpperCase()}`, sections.showEmoji ? 80 : 30, y + 25); }
        y += 60;
      }
      if (sections.showYears) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 90px Arial'; ctx.textAlign = 'center';
        ctx.fillText(String(ageData.years), rect.width / 2, y + 75); ctx.textAlign = 'left';
        ctx.font = 'bold 20px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'center';
        ctx.fillText('YEARS OLD', rect.width / 2, y + 100); ctx.textAlign = 'left';
        if (sections.showMonthsDays) { ctx.font = '14px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'center'; ctx.fillText(`${ageData.months} months · ${ageData.days} days`, rect.width / 2, y + 120); ctx.textAlign = 'left'; }
        y += 145;
      }
      
      const statItems = [
        { show: sections.showTotalDays, label: '📅 Days', value: formatNumber(ageData.totalDays) },
        { show: sections.showAgeInMonths, label: '📆 Months', value: formatNumber(ageData.ageInMonths) },
        { show: sections.showTotalWeeks, label: '📋 Weeks', value: formatNumber(ageData.totalWeeks) },
        { show: sections.showTotalHours, label: '⏰ Hours', value: formatNumber(ageData.totalHours) },
        { show: sections.showDaysUntilBirthday, label: '🎂 To Bday', value: String(ageData.daysUntilBirthday) },
        { show: sections.showLifePercentage, label: '📈 Life %', value: ageData.lifePercentage + '%' },
      ].filter(s => s.show);
      
      if (statItems.length > 0) {
        const cols = Math.min(statItems.length, 3);
        const cardW = (rect.width - 60) / cols - 8;
        statItems.forEach((item, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(30 + col * (cardW + 8), y + row * 55, cardW, 45);
          ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center';
          ctx.fillText(item.value, 30 + col * (cardW + 8) + cardW / 2, y + row * 55 + 25); ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px Arial'; ctx.textAlign = 'center';
          ctx.fillText(item.label, 30 + col * (cardW + 8) + cardW / 2, y + row * 55 + 40); ctx.textAlign = 'left';
        });
      }
      
      if (sections.showWatermark) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Arial'; ctx.textAlign = 'center';
        ctx.fillText('centre.com.pk · Free Age Calculator', rect.width / 2, rect.height - 15); ctx.textAlign = 'left';
      }
      
      const link = document.createElement('a');
      link.download = `age-card-${ageData.years}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setIsDownloading(false);
    } catch (err) { setIsDownloading(false); alert('Download failed. Try screenshot instead.'); }
  };

  const emojiOptions = ['🎂', '🎉', '🎈', '🎊', '⭐', '🌟', '💫', '🔥', '💖', '🦁', '🐯', '🦄', '🌈', '🍀', '💎'];
  
  const tabs = [
    { id: 'template' as const, icon: Star, label: 'Template' },
    { id: 'colors' as const, icon: Palette, label: 'Colors' },
    { id: 'background' as const, icon: Image, label: 'BG' },
    { id: 'sections' as const, icon: Settings, label: 'Sections' },
    { id: 'message' as const, icon: Type, label: 'Msg' },
  ];

  return (
    <>
      <div className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
      <div ref={modalRef} className={`fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.target === modalRef.current && handleClose()}>
        <div className="relative w-full max-w-lg rounded-2xl shadow-2xl border max-h-[95vh] overflow-y-auto" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
          
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 border-b rounded-t-2xl" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
            <div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: themeColors.text.primary }}>Share Your Age Results</h2>
              <p className="text-[11px] sm:text-xs" style={{ color: themeColors.text.secondary }}>Customize & share your card</p>
            </div>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10" style={{ color: themeColors.text.secondary }}><X className="w-5 h-5" /></button>
          </div>

          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            
            {/* ✅ Token Status Bar */}
            {shareToken && (
              <div className="p-2.5 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 flex items-center gap-2">
                <Timer className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">✅ Link Active · {planLabel} · {timeRemaining || '...'}</span>
              </div>
            )}
            {tokenError && (
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">{tokenError}</span>
              </div>
            )}

            {/* Card Preview */}
            <div className="flex justify-center">
              <div ref={cardRef} className="relative w-full max-w-[280px] sm:max-w-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-lg" style={{ background: colorPreset.bg, ...(pattern.style ? { backgroundImage: `${pattern.style}, ${colorPreset.bg}`, backgroundSize: pattern.size ? `${pattern.size}, cover` : 'cover' } : {}) }}>
                <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full opacity-20 bg-white blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-15 bg-white blur-2xl" />
                <div className="relative p-4 sm:p-5 min-h-[160px] sm:min-h-[200px]">
                  {!hasAnyContent && <div className="flex items-center justify-center h-32 sm:h-40 text-white/50 text-sm"><div className="text-center"><Settings className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>Enable sections below</p></div></div>}
                  {(sections.showEmoji || sections.showZodiac) && (
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {sections.showEmoji && <span className="text-2xl sm:text-3xl">{selectedEmoji}</span>}
                        <div><div className="text-[9px] sm:text-xs text-white/70 uppercase tracking-wider">Age Card</div>{sections.showZodiac && <div className="text-xs sm:text-sm font-bold text-white">{getZodiacEmoji(ageData.zodiacSignKey)} {ageData.zodiacSignKey.toUpperCase()}</div>}</div>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg bg-white/20">🧮</div>
                    </div>
                  )}
                  {ageData.isBirthdayToday && sections.showYears && <div className="mb-3 p-2 rounded-xl text-center font-bold text-xs sm:text-sm bg-white/20 text-white">🎂🎉 TODAY IS MY BIRTHDAY! 🎉🎂</div>}
                  {sections.showYears && (
                    <div className="text-center mb-3">
                      <div className="text-[3.5rem] sm:text-[4.5rem] font-black text-white leading-none">{ageData.years}</div>
                      <div className="text-sm sm:text-base text-white/80 font-semibold">YEARS OLD</div>
                      {sections.showMonthsDays && <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] sm:text-sm text-white/60"><span>{ageData.months} months</span><span>·</span><span>{ageData.days} days</span></div>}
                    </div>
                  )}
                  {visibleExtraSections > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3">
                      {sections.showTotalDays && <div className="p-2 sm:p-2.5 rounded-xl text-center bg-white/20"><div className="text-lg sm:text-xl font-bold text-white">{formatNumber(ageData.totalDays)}</div><div className="text-[8px] sm:text-[10px] text-white/70">📅 Days</div></div>}
                      {sections.showAgeInMonths && <div className="p-2 sm:p-2.5 rounded-xl text-center bg-white/20"><div className="text-lg sm:text-xl font-bold text-white">{formatNumber(ageData.ageInMonths)}</div><div className="text-[8px] sm:text-[10px] text-white/70">📆 Months</div></div>}
                      {sections.showTotalWeeks && <div className="p-2 sm:p-2.5 rounded-xl text-center bg-white/20"><div className="text-lg sm:text-xl font-bold text-white">{formatNumber(ageData.totalWeeks)}</div><div className="text-[8px] sm:text-[10px] text-white/70">📋 Weeks</div></div>}
                      {sections.showTotalHours && <div className="p-2 sm:p-2.5 rounded-xl text-center bg-white/20"><div className="text-lg sm:text-xl font-bold text-white">{formatNumber(ageData.totalHours)}</div><div className="text-[8px] sm:text-[10px] text-white/70">⏰ Hours</div></div>}
                      {sections.showDaysUntilBirthday && <div className="p-2 sm:p-2.5 rounded-xl text-center bg-white/20"><div className="text-lg sm:text-xl font-bold text-white">{ageData.daysUntilBirthday}</div><div className="text-[8px] sm:text-[10px] text-white/70">🎂 Days</div></div>}
                      {sections.showLifePercentage && <div className="p-2 sm:p-2.5 rounded-xl text-center bg-white/20"><div className="text-lg sm:text-xl font-bold text-white">{ageData.lifePercentage}%</div><div className="text-[8px] sm:text-[10px] text-white/70">📈 Progress</div></div>}
                    </div>
                  )}
                  {sections.showBirthdayCountdown && <div className="p-2 sm:p-3 rounded-xl text-center mb-2 bg-white/20"><div className="text-[9px] sm:text-xs text-white/60">Next Birthday</div><div className="text-lg sm:text-xl font-bold text-white">{ageData.daysUntilBirthday} <span className="text-xs sm:text-sm font-normal text-white/80">DAYS</span></div></div>}
                  {sections.showNextBirthdayDate && <div className="p-2 sm:p-3 rounded-xl text-center mb-2 bg-white/20"><div className="text-[9px] sm:text-xs text-white/60">Next Birthday</div><div className="text-sm sm:text-base font-bold text-white">{ageData.formattedNextBirthday}</div></div>}
                  {sections.showCustomMessage && customMessage && <div className="mt-2 p-2 sm:p-3 rounded-xl bg-white/10 text-center"><p className="text-xs sm:text-sm text-white italic">&ldquo;{customMessage}&rdquo;</p></div>}
                  {sections.showWatermark && <div className="text-center text-[8px] sm:text-[10px] text-white/40 mt-3">centre.com.pk</div>}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl" style={{ backgroundColor: themeColors.surface }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${activeTab === tab.id ? 'text-white shadow-md scale-[1.02]' : ''}`}
                    style={activeTab === tab.id ? { backgroundColor: themeColors.primary } : { color: themeColors.text.secondary }}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /><span className="hidden xs:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Template Tab */}
            {activeTab === 'template' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {TEMPLATES.map((tpl) => (
                  <button key={tpl.id} onClick={() => setSelectedTemplate(tpl.id)} className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all ${selectedTemplate === tpl.id ? 'shadow-md scale-[1.03]' : 'hover:shadow-sm'}`}
                    style={selectedTemplate === tpl.id ? { borderColor: themeColors.primary, backgroundColor: `${themeColors.primary}15` } : { borderColor: themeColors.border }}>
                    <div className="text-2xl sm:text-3xl mb-1.5">{tpl.icon}</div>
                    <div className="text-xs sm:text-sm font-semibold" style={{ color: themeColors.text.primary }}>{tpl.name}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div>
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mb-4">
                  {COLOR_PRESETS.map((preset, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)} className={`h-11 sm:h-14 rounded-xl transition-all hover:scale-105 ${selectedColor === i ? 'ring-2 ring-offset-2 scale-105 shadow-lg' : ''}`}
                      style={{ background: preset.bg, ...(selectedColor === i ? { ringColor: themeColors.primary } : {}) }} title={`${preset.name}${i === 0 ? ' (Theme Default)' : ''}`}>
                      {i === 0 && <span className="text-[9px] text-white font-bold bg-black/20 px-1 rounded">Theme</span>}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: themeColors.text.secondary }}><Smile className="w-3.5 h-3.5" /> Emoji</label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {emojiOptions.map((emoji) => (
                      <button key={emoji} onClick={() => { setSelectedEmoji(emoji); if (!sections.showEmoji) toggleSection('showEmoji'); }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 text-base sm:text-lg rounded-lg border transition-all hover:scale-115 ${selectedEmoji === emoji && sections.showEmoji ? 'ring-2' : 'hover:border-primary/50'}`}
                        style={selectedEmoji === emoji && sections.showEmoji ? { borderColor: themeColors.primary, backgroundColor: `${themeColors.primary}08` } : { borderColor: themeColors.border }}>{emoji}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Background Tab */}
            {activeTab === 'background' && (
              <div>
                <label className="text-[11px] sm:text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: themeColors.text.secondary }}><Image className="w-3.5 h-3.5" /> Pattern</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {BG_PATTERNS.map((pat, i) => (
                    <button key={pat.id} onClick={() => setSelectedPattern(i)} className={`h-14 sm:h-16 rounded-xl transition-all flex items-center justify-center ${selectedPattern === i ? 'ring-2 scale-[1.02]' : ''}`}
                      style={{ background: colorPreset.bg, ...(pat.style ? { backgroundImage: `${pat.style}, ${colorPreset.bg}`, backgroundSize: pat.size ? `${pat.size}, cover` : 'cover' } : {}), ...(selectedPattern === i ? { ringColor: themeColors.primary } : {}) }}>
                      <span className="text-white text-[11px] sm:text-xs font-semibold bg-black/25 px-3 py-1.5 rounded-full">{pat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <label className="text-[11px] sm:text-xs font-semibold" style={{ color: themeColors.text.secondary }}>Toggle Sections</label>
                  <div className="flex gap-1">
                    <button onClick={() => setSections({ showEmoji: true, showYears: true, showMonthsDays: true, showZodiac: true, showTotalDays: true, showAgeInMonths: true, showTotalWeeks: true, showTotalHours: true, showDaysUntilBirthday: true, showLifePercentage: true, showBirthdayCountdown: true, showNextBirthdayDate: true, showCustomMessage: true, showWatermark: true })}
                      className="px-2 py-1 text-[10px] rounded-lg bg-green-50 text-green-600 border border-green-200 font-medium">All On</button>
                    <button onClick={() => setSections({ showEmoji: false, showYears: false, showMonthsDays: false, showZodiac: false, showTotalDays: false, showAgeInMonths: false, showTotalWeeks: false, showTotalHours: false, showDaysUntilBirthday: false, showLifePercentage: false, showBirthdayCountdown: false, showNextBirthdayDate: false, showCustomMessage: false, showWatermark: false })}
                      className="px-2 py-1 text-[10px] rounded-lg bg-red-50 text-red-600 border border-red-200 font-medium">All Off</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {[
                    { key: 'showEmoji' as const, label: '😊 Emoji' }, { key: 'showYears' as const, label: '🎯 Years' },
                    { key: 'showMonthsDays' as const, label: '📆 M&D' }, { key: 'showZodiac' as const, label: '⭐ Zodiac' },
                    { key: 'showTotalDays' as const, label: '📅 Days' }, { key: 'showAgeInMonths' as const, label: '📊 Months' },
                    { key: 'showTotalWeeks' as const, label: '📋 Weeks' }, { key: 'showTotalHours' as const, label: '⏰ Hours' },
                    { key: 'showDaysUntilBirthday' as const, label: '🎂 To Bday' }, { key: 'showLifePercentage' as const, label: '📈 Life %' },
                    { key: 'showBirthdayCountdown' as const, label: '⏳ Countdown' }, { key: 'showNextBirthdayDate' as const, label: '🗓️ Date' },
                    { key: 'showWatermark' as const, label: '💧 Watermark' },
                  ].map((item) => (
                    <button key={item.key} onClick={() => toggleSection(item.key)} className={`flex items-center gap-1 p-2 sm:py-2.5 sm:px-2 rounded-lg border text-[10px] sm:text-[11px] font-medium transition-all ${sections[item.key] ? '' : 'opacity-60 hover:opacity-100'}`}
                      style={sections[item.key] ? { borderColor: themeColors.primary, backgroundColor: `${themeColors.primary}15`, color: themeColors.primary } : { borderColor: themeColors.border, color: themeColors.text.secondary }}>
                      <span className="text-xs sm:text-sm">{item.label.split(' ')[0]}</span><span className="truncate">{item.label.split(' ').slice(1).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Tab */}
            {activeTab === 'message' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] sm:text-xs font-semibold" style={{ color: themeColors.text.secondary }}>Custom Message</label>
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={sections.showCustomMessage} onChange={() => toggleSection('showCustomMessage')} className="rounded" /><span className="text-[10px] sm:text-[11px]" style={{ color: themeColors.text.secondary }}>Show</span></label>
                </div>
                <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value.slice(0, 200))} placeholder="Your personal message..." maxLength={200} rows={3}
                  className="w-full p-3 rounded-xl border text-sm resize-none focus:ring-2" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface, color: themeColors.text.primary }} />
                <div className="text-right text-[10px] mt-1" style={{ color: themeColors.text.secondary }}>{customMessage.length}/200</div>
              </div>
            )}

            {/* Share Buttons */}
            <div>
              <label className="text-[11px] sm:text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: themeColors.text.secondary }}><Share2 className="w-3.5 h-3.5" /> Share via</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                {[
                  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: '#25D366' },
                  { id: 'facebook', icon: Facebook, label: 'Facebook', color: '#1877F2' },
                  { id: 'twitter', icon: Twitter, label: 'Twitter', color: '#0EA5E9' },
                  { id: 'telegram', icon: Send, label: 'Telegram', color: '#06B6D4' },
                  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
                ].map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <button key={btn.id} onClick={() => handleShare(btn.id)} disabled={isCreatingToken}
                      className="flex flex-col items-center gap-1 p-3 sm:p-3.5 rounded-xl text-white text-[10px] sm:text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50"
                      style={{ backgroundColor: btn.color }}>
                      {isCreatingToken ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5 sm:w-5 sm:h-5" />}<span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button onClick={handleCopy} disabled={isCreatingToken}
                className="flex items-center justify-center gap-1.5 p-3 sm:p-3.5 rounded-xl border-2 transition-all text-[11px] sm:text-xs font-semibold hover:bg-black/5 disabled:opacity-50"
                style={{ borderColor: themeColors.border, color: themeColors.text.primary }}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}Text
              </button>
              <button onClick={handleCopyLink} disabled={isCreatingToken}
                className="flex items-center justify-center gap-1.5 p-3 sm:p-3.5 rounded-xl border-2 transition-all text-[11px] sm:text-xs font-semibold hover:bg-black/5 disabled:opacity-50"
                style={{ borderColor: themeColors.border, color: themeColors.text.primary }}>
                <Link2 className="w-4 h-4" />URL
              </button>
              <button onClick={handleDownload} disabled={isDownloading}
                className="flex items-center justify-center gap-1.5 p-3 sm:p-3.5 rounded-xl border-2 transition-all text-[11px] sm:text-xs font-semibold disabled:opacity-50 hover:bg-black/5"
                style={{ borderColor: themeColors.border, color: themeColors.text.primary }}>
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}PNG
              </button>
            </div>

            {!isPaidUser && (
              <div className="p-2.5 sm:p-3 rounded-xl text-center border" style={{ background: `linear-gradient(135deg, ${themeColors.primary}15, ${themeColors.primary}05)`, borderColor: `${themeColors.primary}30` }}>
                <p className="text-[11px] sm:text-xs" style={{ color: themeColors.primary }}>✨ <strong>Upgrade:</strong> Remove watermark, HD quality, longer expiry</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}