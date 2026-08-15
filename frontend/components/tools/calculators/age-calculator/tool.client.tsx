'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  Calendar, 
  CalendarDays, 
  Download, 
  Share2, 
  Clock, 
  TrendingUp, 
  History,
  Zap,
  Star,
  Target,
  ChartBar,
  Cake,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Edit3,
  Loader2,
  X,
  GripVertical,
} from 'lucide-react';
import { useTheme } from '@/components/theme';

import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';
import SocialShareCard from './SocialShareCard';
import './age-calculator.css';
import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
import PlanetAges from './PlanetAges';
import LegendsBorn from './LegendsBorn';
import RetirementCalculator from './RetirementCalculator';
import ToolReactions from '@/components/engagement/ToolReactions';


// ============================================
// PROFESSIONAL AGE CALCULATION UTILITIES
// ============================================

const calculateAdvancedAge = (birthDate: Date, targetDate: Date = new Date()) => {
  const birth = new Date(birthDate);
  const today = targetDate;
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  let hours = today.getHours() - birth.getHours();
  let minutes = today.getMinutes() - birth.getMinutes();
  let seconds = today.getSeconds() - birth.getSeconds();

  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--;
    hours += 24;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffTime / (1000 * 60));
  const totalSeconds = Math.floor(diffTime / 1000);
  const totalWeeks = Math.floor(totalDays / 7);

  let nextBirthdayYear = today.getFullYear();
  let nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
  
  const isBirthdayToday = 
    today.getMonth() === birth.getMonth() && 
    today.getDate() === birth.getDate();
  
  if (nextBirthday < today || isBirthdayToday) {
    nextBirthdayYear = today.getFullYear() + 1;
    nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
  }

  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const getZodiacSign = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
    return "capricorn";
  };

  const averageLifespan = 80;
  const lifePercentage = ((years / averageLifespan) * 100).toFixed(2);

  const getMilestoneKey = (years: number) => {
    const milestones = [
      { age: 1, key: 'first_birthday' },
      { age: 5, key: 'start_school' },
      { age: 13, key: 'teenager' },
      { age: 16, key: 'sweet_sixteen' },
      { age: 18, key: 'adult' },
      { age: 21, key: 'full_adult' },
      { age: 30, key: 'mid_life_begins' },
      { age: 40, key: 'middle_age' },
      { age: 50, key: 'half_century' },
      { age: 60, key: 'senior_citizen' },
      { age: 70, key: 'platinum_age' },
      { age: 80, key: 'octogenarian' },
      { age: 90, key: 'nonagenarian' },
      { age: 100, key: 'centenarian' },
    ];
    return milestones.find(m => m.age > years) || milestones[milestones.length - 1];
  };

  const nextMilestone = getMilestoneKey(years);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthdayDate: nextBirthday,
    daysUntilBirthday,
    isBirthdayToday,
    zodiacSignKey: getZodiacSign(birth),
    lifePercentage,
    ageInMonths: years * 12 + months,
    ageInWeeks: Math.floor(totalDays / 7),
    nextBirthdayDayName: nextBirthday.toLocaleDateString('en-US', { weekday: 'long' }),
    formattedNextBirthday: nextBirthday.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    nextMilestoneKey: nextMilestone.key,
    yearsToNextMilestone: nextMilestone.age - years
  };
};

const getNextBirthdayInfo = (birthDate: Date, targetDate: Date = new Date()) => {
  const today = targetDate;
  const birth = birthDate;
  
  let nextBirthdayYear = today.getFullYear();
  let nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
  
  const isBirthdayToday = 
    today.getMonth() === birth.getMonth() && 
    today.getDate() === birth.getDate();
  
  if (nextBirthday < today || isBirthdayToday) {
    nextBirthdayYear = today.getFullYear() + 1;
    nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
  }

  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const nextBirthdayDayName = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });
  const nextBirthdayFormatted = nextBirthday.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let monthsRemaining = nextBirthday.getMonth() - today.getMonth();
  let daysRemaining = nextBirthday.getDate() - today.getDate();
  
  if (daysRemaining < 0) {
    monthsRemaining--;
    const prevMonth = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), 0);
    daysRemaining += prevMonth.getDate();
  }
  
  if (monthsRemaining < 0) {
    monthsRemaining += 12;
  }

  return {
    nextBirthdayDate: nextBirthday,
    nextBirthdayDayName,
    nextBirthdayFormatted,
    daysUntilBirthday,
    monthsRemaining,
    daysRemaining,
    isBirthdayToday,
    ageOnNextBirthday: nextBirthdayYear - birth.getFullYear()
  };
};

const formatDateForDisplay = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ============================================
// ✅ MOBILE-STYLE SCROLL PICKER COMPONENT
// ============================================
const ScrollPicker = ({ 
  items, 
  value, 
  onChange, 
  placeholder 
}: { 
  items: { label: string; value: string | number }[];
  value: string | number;
  onChange: (val: string) => void;
  placeholder: string;
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: string | number) => {
    onChange(String(val));
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentLabel = items.find(i => String(i.value) === String(value))?.label || placeholder;

  return (
    <div ref={pickerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="scroll-picker-trigger"
      >
        <span className={value ? 'picker-value' : 'picker-placeholder'}>{currentLabel}</span>
        <ChevronDown size={14} className={`picker-arrow ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="scroll-picker-dropdown">
          <div className="scroll-picker-list">
            {items.map((item) => (
              <button
                key={String(item.value)}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={`scroll-picker-item ${String(value) === String(item.value) ? 'selected' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProfessionalAgeCalculator() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  
  const [mounted, setMounted] = useState(false);
  
  // ✅ Birth Date State
  const [birthDate, setBirthDate] = useState('');
  const [showManualBirth, setShowManualBirth] = useState(false);
  const [manualBirthDay, setManualBirthDay] = useState('');
  const [manualBirthMonth, setManualBirthMonth] = useState('');
  const [manualBirthYear, setManualBirthYear] = useState('');
  const [birthInputError, setBirthInputError] = useState('');
  
  // ✅ Target Date State
  const [targetDate, setTargetDate] = useState('');
  const [showManualTarget, setShowManualTarget] = useState(false);
  const [manualTargetDay, setManualTargetDay] = useState('');
  const [manualTargetMonth, setManualTargetMonth] = useState('');
  const [manualTargetYear, setManualTargetYear] = useState('');
  const [targetInputError, setTargetInputError] = useState('');
  
  const [advancedAge, setAdvancedAge] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [calculationHistory, setCalculationHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'timeline'>('basic');
  const [showShareModal, setShowShareModal] = useState(false);
  const [nextBirthdayInfo, setNextBirthdayInfo] = useState<any>(null);
  
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('');
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSuccessPulse, setShowSuccessPulse] = useState(false);

  // ✅ Day list: 1-31
  const days = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: i + 1 }));
  
  // ✅ Month list: 1-12
  const months = [
    { label: '01 - January', value: 1 }, { label: '02 - February', value: 2 },
    { label: '03 - March', value: 3 }, { label: '04 - April', value: 4 },
    { label: '05 - May', value: 5 }, { label: '06 - June', value: 6 },
    { label: '07 - July', value: 7 }, { label: '08 - August', value: 8 },
    { label: '09 - September', value: 9 }, { label: '10 - October', value: 10 },
    { label: '11 - November', value: 11 }, { label: '12 - December', value: 12 },
  ];
  
  // ✅ Year list: 1947-2026 (Pakistan independence onwards)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1947 + 1 }, (_, i) => ({
    label: String(1947 + i),
    value: 1947 + i,
  })).reverse(); // Most recent first

  const safeT = (key: string, defaultValue: string = ''): string => {
    try {
      const result = tTools(key);
      if (result && typeof result === 'object') return defaultValue || key;
      if (typeof result === 'string' && result !== key) return result;
      return defaultValue || key;
    } catch { return defaultValue || key; }
  };

  const safeTCommon = (key: string, defaultValue: string = ''): string => {
    try {
      const result = tCommon(key);
      if (result && typeof result === 'object') return defaultValue || key;
      if (typeof result === 'string' && result !== key) return result;
      return defaultValue || key;
    } catch { return defaultValue || key; }
  };

  const getZodiacTranslation = (key: string): string => {
    const zodiacMap: Record<string, string> = {
      'aries': 'Aries ♈', 'taurus': 'Taurus ♉', 'gemini': 'Gemini ♊', 'cancer': 'Cancer ♋',
      'leo': 'Leo ♌', 'virgo': 'Virgo ♍', 'libra': 'Libra ♎', 'scorpio': 'Scorpio ♏',
      'sagittarius': 'Sagittarius ♐', 'capricorn': 'Capricorn ♑', 'aquarius': 'Aquarius ♒', 'pisces': 'Pisces ♓',
    };
    return zodiacMap[key] || key;
  };

  const getMilestoneTranslation = (key: string): string => {
    const milestoneMap: Record<string, string> = {
      'first_birthday': 'First Birthday', 'start_school': 'Start School', 'teenager': 'Teenager',
      'sweet_sixteen': 'Sweet Sixteen', 'adult': 'Adult', 'full_adult': 'Full Adult',
      'mid_life_begins': 'Mid-Life Begins', 'middle_age': 'Middle Age', 'half_century': 'Half-Century',
      'senior_citizen': 'Senior Citizen', 'platinum_age': 'Platinum Age', 'octogenarian': 'Octogenarian',
      'nonagenarian': 'Nonagenarian', 'centenarian': 'Centenarian',
    };
    return milestoneMap[key] || key;
  };

  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (!mounted) return;
    const savedHistory = localStorage.getItem('ageCalculatorHistory');
    if (savedHistory) {
      try { setCalculationHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
    const today = new Date().toISOString().split('T')[0];
    setTargetDate(today);
    updateCurrentDateTime();
    const interval = setInterval(updateCurrentDateTime, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  const updateCurrentDateTime = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString(lang === 'ur' || lang === 'ar' ? 'ur-PK' : 'en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString(lang === 'ur' || lang === 'ar' ? 'ur-PK' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
    setTimezone(currentTimezone);
  };

  useEffect(() => {
    if (!mounted) return;
    if (birthDate) {
      const birth = new Date(birthDate);
      const target = targetDate ? new Date(targetDate) : new Date();
      const info = getNextBirthdayInfo(birth, target);
      setNextBirthdayInfo(info);
    } else {
      setNextBirthdayInfo(null);
    }
  }, [birthDate, targetDate, mounted]);

  // ✅ Validate scroll picker birth date
  const validateScrollBirthDate = () => {
    const day = parseInt(manualBirthDay);
    const month = parseInt(manualBirthMonth);
    const year = parseInt(manualBirthYear);
    
    if (!day || !month || !year) {
      setBirthInputError('Please select Day, Month, and Year');
      return;
    }
    
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime()) || date.getDate() !== day) {
      setBirthInputError('Invalid date. Please check your selection.');
      return;
    }
    
    const formatted = formatDateForDisplay(date);
    setBirthDate(formatted);
    setBirthInputError('');
  };

  // ✅ Validate scroll picker target date
  const validateScrollTargetDate = () => {
    const day = parseInt(manualTargetDay);
    const month = parseInt(manualTargetMonth);
    const year = parseInt(manualTargetYear);
    
    if (!day || !month || !year) {
      setTargetInputError('Please select Day, Month, and Year');
      return;
    }
    
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime()) || date.getDate() !== day) {
      setTargetInputError('Invalid date. Please check your selection.');
      return;
    }
    
    const formatted = formatDateForDisplay(date);
    setTargetDate(formatted);
    setTargetInputError('');
  };

  // ✅ Apply scroll picker values for birth date
  const handleApplyBirthScroll = () => {
    if (manualBirthDay && manualBirthMonth && manualBirthYear) {
      validateScrollBirthDate();
    }
  };

  // ✅ Apply scroll picker values for target date
  const handleApplyTargetScroll = () => {
    if (manualTargetDay && manualTargetMonth && manualTargetYear) {
      validateScrollTargetDate();
    }
  };

  const toggleBirthInputMode = () => {
    if (!showManualBirth) {
      if (birthDate) {
        const parts = birthDate.split('-');
        if (parts.length === 3) {
          setManualBirthDay(parts[2]);
          setManualBirthMonth(parts[1]);
          setManualBirthYear(parts[0]);
        }
      } else {
        // Set to today's date as default
        const today = new Date();
        setManualBirthDay(String(today.getDate()));
        setManualBirthMonth(String(today.getMonth() + 1));
        setManualBirthYear(String(today.getFullYear() - 25)); // Default 25 years ago
      }
    }
    setShowManualBirth(!showManualBirth);
    setBirthInputError('');
  };

  const toggleTargetInputMode = () => {
    if (!showManualTarget) {
      if (targetDate) {
        const parts = targetDate.split('-');
        if (parts.length === 3) {
          setManualTargetDay(parts[2]);
          setManualTargetMonth(parts[1]);
          setManualTargetYear(parts[0]);
        }
      } else {
        const today = new Date();
        setManualTargetDay(String(today.getDate()));
        setManualTargetMonth(String(today.getMonth() + 1));
        setManualTargetYear(String(today.getFullYear()));
      }
    }
    setShowManualTarget(!showManualTarget);
    setTargetInputError('');
  };

  const calculateAge = () => {
    if (!birthDate) return;
    setIsCalculating(true);
    setShowSuccessPulse(false);
    
    const birth = new Date(birthDate);
    const target = targetDate ? new Date(targetDate) : new Date();
    const result = calculateAdvancedAge(birth, target);
    const info = getNextBirthdayInfo(birth, target);
    
    setAdvancedAge(result);
    setNextBirthdayInfo(info);
    setIsCalculating(false);
    setShowSuccessPulse(true);

    const historyEntry = {
      id: Date.now(),
      birthDate,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      result,
      timestamp: new Date().toISOString()
    };
    const newHistory = [historyEntry, ...calculationHistory.slice(0, 9)];
    setCalculationHistory(newHistory);
    try { localStorage.setItem('ageCalculatorHistory', JSON.stringify(newHistory)); } catch (e) {}
    
    setTimeout(() => {
      document.querySelector('.results-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    setTimeout(() => setShowSuccessPulse(false), 1500);
  };

  const resetCalculator = () => {
    setBirthDate('');
    setManualBirthDay('');
    setManualBirthMonth('');
    setManualBirthYear('');
    setTargetDate('');
    setManualTargetDay('');
    setManualTargetMonth('');
    setManualTargetYear('');
    setAdvancedAge(null);
    setNextBirthdayInfo(null);
    setShowManualBirth(false);
    setShowManualTarget(false);
    setBirthInputError('');
    setTargetInputError('');
    setIsCalculating(false);
    setShowSuccessPulse(false);
  };

  const copyResults = () => {
    if (!advancedAge) return;
    const text = `My age is ${advancedAge.years} years, ${advancedAge.months} months, and ${advancedAge.days} days old. 
Total days lived: ${advancedAge.totalDays.toLocaleString()}
Next birthday: ${advancedAge.formattedNextBirthday} (in ${advancedAge.daysUntilBirthday} days)
Zodiac: ${getZodiacTranslation(advancedAge.zodiacSignKey)}
Life progress: ${advancedAge.lifePercentage}% of average lifespan`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportAsText = () => {
    if (!advancedAge) return;
    const text = `=== AGE CALCULATION REPORT ===
Date: ${new Date().toLocaleDateString()}
Birth Date: ${birthDate}
Age on: ${targetDate || 'Today'}

AGE BREAKDOWN:
• ${advancedAge.years} years
• ${advancedAge.months} months
• ${advancedAge.days} days
• ${advancedAge.hours} hours
• ${advancedAge.minutes} minutes
• ${advancedAge.seconds} seconds

TOTAL MEASUREMENTS:
• ${advancedAge.totalDays.toLocaleString()} total days
• ${advancedAge.totalWeeks} weeks
• ${advancedAge.totalHours.toLocaleString()} hours
• ${advancedAge.ageInMonths} months old
• ${advancedAge.ageInWeeks} weeks old

BIRTHDAY INFO:
• Next birthday: ${advancedAge.formattedNextBirthday}
• Days until next birthday: ${advancedAge.daysUntilBirthday}
• Will be on: ${advancedAge.nextBirthdayDayName}
${advancedAge.isBirthdayToday ? '• 🎉 TODAY IS YOUR BIRTHDAY! 🎂' : ''}

ZODIAC & LIFE:
• Zodiac Sign: ${getZodiacTranslation(advancedAge.zodiacSignKey)}
• Life progress: ${advancedAge.lifePercentage}% of average lifespan

=== Generated by Centre.com.pk Age Calculator ===`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `age-calculation-${birthDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateFromHistory = (historyItem: any) => {
    setBirthDate(historyItem.birthDate);
    setTargetDate(historyItem.targetDate);
    setAdvancedAge(historyItem.result);
    const birth = new Date(historyItem.birthDate);
    const target = new Date(historyItem.targetDate);
    const info = getNextBirthdayInfo(birth, target);
    setNextBirthdayInfo(info);
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    try { localStorage.removeItem('ageCalculatorHistory'); } catch (e) {}
  };

  const isLoading = !mounted || commonLoading || toolsLoading;
  
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: themeColors?.background || '#ffffff' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <div className="animate-pulse text-primary text-lg">{safeTCommon('loading', 'Loading...')}</div>
            <p className="text-text-secondary mt-2">{safeTCommon('please_wait', 'Please wait...')}</p>
          </div>
        </div>
      </div>
    );
  }

  const getDynamicStyles = () => {
    return {
      '--primary': themeColors.primary || '#2563EB',
      '--primary-light': `${themeColors.primary || '#2563EB'}20`,
      '--primary-lighter': `${themeColors.primary || '#2563EB'}10`,
      '--secondary': themeColors.secondary || '#1f7190',
      '--background': themeColors.background || '#FFFFFF',
      '--surface': themeColors.surface || '#F8FAFC',
      '--text-primary': themeColors.text?.primary || '#1E293B',
      '--text-secondary': themeColors.text?.secondary || '#475569',
      '--text-accent': themeColors.text?.accent || '#0A1929',
      '--border': themeColors.border || '#E2E8F0',
      '--success': themeColors.success || '#10B981',
      '--warning': themeColors.warning || '#F59E0B',
      '--error': themeColors.error || '#EF4444',
      '--shadow': themeColors.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      '--font-family': fontFamily || 'system-ui, sans-serif',
    } as React.CSSProperties;
  };

  const isRTL = lang === 'ur' || lang === 'ar';

  return (
    <div className="age-calculator-container" dir={isRTL ? 'rtl' : 'ltr'} style={getDynamicStyles()}>
      <CentralAd position="top" size="banner" />
  

      {showShareModal && advancedAge && (
        <SocialShareCard 
          ageData={advancedAge} 
          onClose={() => setShowShareModal(false)} 
          isPaidUser={false}
        />
      )}

      <header className="age-calculator-header">
        <div className="header-badge">
          <Calculator className="badge-icon" />
          <span className="badge-text">PROFESSIONAL AGE CALCULATOR</span>
        </div>
        <h1 className="header-title">
          Calculate Your <span className="highlight">Exact Age</span> Like Never Before
        </h1>
        <p className="header-description">
          The most advanced age calculator with detailed breakdowns, life milestones, zodiac signs, and export features. 
          <span className="highlight-text"> 100% free, privacy-first.</span>
        </p>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">AI</div><div className="stat-label">Precision</div></div>
          <div className="stat-card"><div className="stat-number">13+</div><div className="stat-label">Metrics</div></div>
          <div className="stat-card"><div className="stat-number">Export</div><div className="stat-label">Reports</div></div>
          <div className="stat-card"><div className="stat-number">Secure</div><div className="stat-label">Privacy</div></div>
        </div>
      </header>

      <main className="age-calculator-main">
        <aside className="calculator-sidebar">
          <CentralAd position="sidebar-left" size="skyscraper" />
          <div className="sidebar-section">
            <div className="sidebar-header"><Zap className="sidebar-icon" /><h3 className="sidebar-title">Quick Actions</h3></div>
            <div className="sidebar-actions">
              <button className={`sidebar-action ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')} type="button"><Calculator className="action-icon" /><span>Basic</span></button>
              <button className={`sidebar-action ${activeTab === 'advanced' ? 'active' : ''}`} onClick={() => setActiveTab('advanced')} type="button"><TrendingUp className="action-icon" /><span>Advanced</span></button>
              <button className={`sidebar-action ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')} type="button"><ChartBar className="action-icon" /><span>Timeline</span></button>
            </div>
          </div>
          {calculationHistory.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-header"><History className="sidebar-icon" /><h3 className="sidebar-title">Recent</h3></div>
              <div className="history-list">
                {calculationHistory.slice(0, 5).map((item) => (
                  <button key={item.id} className="history-item" onClick={() => calculateFromHistory(item)} type="button">
                    <div className="history-date">{new Date(item.birthDate).toLocaleDateString(lang === 'ur' || lang === 'ar' ? 'ur-PK' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="history-result">{item.result.years}y {item.result.months}m {item.result.days}d</div>
                  </button>
                ))}
              </div>
              <button className="clear-history" onClick={clearHistory} type="button">Clear</button>
            </div>
          )}
        </aside>

        <section className="calculator-main">
          <div className="date-info-grid">
            <div className="date-card today">
              <div className="date-card-header">
                <div className="date-card-icon"><CalendarDays className="icon" /></div>
                <div className="date-card-title"><h4>Today's Date</h4><p className="date-card-subtitle">Current Date & Time</p></div>
              </div>
              <div className="date-card-content">
                <div className="current-date">{currentDate || 'Loading...'}</div>
                <div className="current-time">{currentTime || 'Loading...'}</div>
              </div>
              <div className="date-card-footer"><span className="time-zone">Timezone: {timezone || 'Loading...'}</span></div>
            </div>

            <div className={`date-card birthday ${nextBirthdayInfo?.isBirthdayToday ? 'birthday-today' : ''}`}>
              <div className="date-card-header">
                <div className="date-card-icon"><Cake className="icon" /></div>
                <div className="date-card-title">
                  <h4>{nextBirthdayInfo?.isBirthdayToday ? '🎉 Happy Birthday!' : 'Next Birthday'}</h4>
                  <p className="date-card-subtitle">{nextBirthdayInfo?.isBirthdayToday ? 'Today is your special day!' : 'Countdown to your next birthday'}</p>
                </div>
              </div>
              {nextBirthdayInfo ? (
                <div className="date-card-content">
                  {nextBirthdayInfo.isBirthdayToday ? (
                    <div className="birthday-today-content">
                      <div className="celebration-emoji">🎂🎉🎁</div>
                      <div className="birthday-message">Wishing you a fantastic birthday! Enjoy your special day!</div>
                    </div>
                  ) : (
                    <>
                      <div className="birthday-countdown">
                        <div className="countdown-numbers">
                          <div className="countdown-item"><span className="countdown-value">{nextBirthdayInfo.monthsRemaining}</span><span className="countdown-label">Months</span></div>
                          <div className="countdown-separator">:</div>
                          <div className="countdown-item"><span className="countdown-value">{nextBirthdayInfo.daysRemaining}</span><span className="countdown-label">Days</span></div>
                        </div>
                        <div className="countdown-total">Total: <span className="total-days">{nextBirthdayInfo.daysUntilBirthday}</span> days remaining</div>
                      </div>
                      <div className="birthday-details">
                        <div className="detail-row"><span className="detail-label">Date:</span><span className="detail-value">{nextBirthdayInfo.nextBirthdayFormatted}</span></div>
                        <div className="detail-row"><span className="detail-label">Day:</span><span className="detail-value">{nextBirthdayInfo.nextBirthdayDayName}</span></div>
                        <div className="detail-row"><span className="detail-label">You will turn:</span><span className="detail-value">{nextBirthdayInfo.ageOnNextBirthday} years old</span></div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="date-card-content empty">
                  <div className="empty-message"><Cake className="empty-icon" /><p>Enter your birth date to see birthday details</p></div>
                </div>
              )}
              {nextBirthdayInfo && !nextBirthdayInfo.isBirthdayToday && (
                <div className="date-card-footer"><span className="upcoming-text">🎂 Upcoming birthday celebration</span></div>
              )}
            </div>
          </div>

          <div className="calculator-card">
            <div className="input-section">
              {/* ============================================ */}
              {/* ✅ DATE OF BIRTH — Calendar + Scroll Picker */}
              {/* ============================================ */}
              <div className="input-group">
                <label className="input-label">
                  <Calendar className="label-icon" />
                  Date of Birth
                </label>
                <div className="input-with-toggle">
                  {showManualBirth ? (
                    <div className="scroll-picker-container">
                      <div className="scroll-picker-row">
                        <div className="scroll-picker-col">
                          <label className="scroll-picker-label">Day</label>
                          <ScrollPicker
                            items={days}
                            value={manualBirthDay}
                            onChange={setManualBirthDay}
                            placeholder="DD"
                          />
                        </div>
                        <div className="scroll-picker-col">
                          <label className="scroll-picker-label">Month</label>
                          <ScrollPicker
                            items={months}
                            value={manualBirthMonth}
                            onChange={setManualBirthMonth}
                            placeholder="MM"
                          />
                        </div>
                        <div className="scroll-picker-col">
                          <label className="scroll-picker-label">Year</label>
                          <ScrollPicker
                            items={years}
                            value={manualBirthYear}
                            onChange={setManualBirthYear}
                            placeholder="YYYY"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="scroll-picker-apply-btn"
                        onClick={handleApplyBirthScroll}
                      >
                        Apply Date
                      </button>
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="date-input"
                      max={new Date().toISOString().split('T')[0]}
                      aria-label="Select your date of birth"
                    />
                  )}
                  <button
                    type="button"
                    className="toggle-input-mode"
                    onClick={toggleBirthInputMode}
                    title={showManualBirth ? 'Use date picker' : 'Use scroll picker'}
                  >
                    <Edit3 className="toggle-icon" size={16} />
                  </button>
                </div>
                {birthInputError && <div className="input-error">{birthInputError}</div>}
                {showManualBirth && (
                  <div className="input-hint">Select Day, Month, and Year — then click Apply Date</div>
                )}
              </div>

              {/* ============================================ */}
              {/* ✅ TARGET DATE — Calendar + Scroll Picker */}
              {/* ============================================ */}
              <div className="input-group">
                <label className="input-label">
                  <Target className="label-icon" />
                  Calculate Age At (Optional)
                </label>
                <div className="input-with-toggle">
                  {showManualTarget ? (
                    <div className="scroll-picker-container">
                      <div className="scroll-picker-row">
                        <div className="scroll-picker-col">
                          <label className="scroll-picker-label">Day</label>
                          <ScrollPicker
                            items={days}
                            value={manualTargetDay}
                            onChange={setManualTargetDay}
                            placeholder="DD"
                          />
                        </div>
                        <div className="scroll-picker-col">
                          <label className="scroll-picker-label">Month</label>
                          <ScrollPicker
                            items={months}
                            value={manualTargetMonth}
                            onChange={setManualTargetMonth}
                            placeholder="MM"
                          />
                        </div>
                        <div className="scroll-picker-col">
                          <label className="scroll-picker-label">Year</label>
                          <ScrollPicker
                            items={years}
                            value={manualTargetYear}
                            onChange={setManualTargetYear}
                            placeholder="YYYY"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="scroll-picker-apply-btn"
                        onClick={handleApplyTargetScroll}
                      >
                        Apply Date
                      </button>
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="date-input"
                      max={new Date().toISOString().split('T')[0]}
                      aria-label="Select target date for age calculation"
                    />
                  )}
                  <button
                    type="button"
                    className="toggle-input-mode"
                    onClick={toggleTargetInputMode}
                    title={showManualTarget ? 'Use date picker' : 'Use scroll picker'}
                  >
                    <Edit3 className="toggle-icon" size={16} />
                  </button>
                </div>
                {targetInputError && <div className="input-error">{targetInputError}</div>}
                <div className="input-hint">Leave empty to calculate age as of today</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={calculateAge}
                disabled={!birthDate || isCalculating}
                className={`calculate-button ${(!birthDate || isCalculating) ? 'disabled' : ''}`}
                type="button"
              >
                {isCalculating ? (
                  <><Loader2 className="button-icon animate-spin" /><span>Calculating...</span></>
                ) : (
                  <><Calculator className="button-icon" /><span>Calculate Exact Age</span></>
                )}
              </button>
              <button onClick={resetCalculator} className="reset-button" type="button" disabled={isCalculating}>
                <RotateCcw className="button-icon" /><span>Reset</span>
              </button>
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="advanced-toggle" type="button" disabled={isCalculating}>
                {showAdvanced ? <><ChevronUp className="button-icon" /><span>Hide Advanced</span></> : <><ChevronDown className="button-icon" /><span>Show Advanced</span></>}
              </button>
            </div>

            {isCalculating && (
              <div className="flex items-center justify-center gap-3 py-4 px-6 mb-4 rounded-xl bg-primary/5 border border-primary/20 animate-pulse">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm font-medium text-primary">Crunching the numbers...</span>
              </div>
            )}

            {advancedAge && (
              <div className={`results-section ${showSuccessPulse ? 'results-pulse' : ''}`}>
                <div className="basic-results">
                  <h3 className="results-title">
                    {showSuccessPulse && <span className="inline-block animate-bounce mr-2">✅</span>}
                    Your Age is: <span className="highlight-result">{advancedAge.years} years, {advancedAge.months} months, {advancedAge.days} days</span>
                  </h3>
                  <div className="results-grid">
                    <div className="result-card primary"><div className="result-value">{advancedAge.years}</div><div className="result-label">Years</div></div>
                    <div className="result-card success"><div className="result-value">{advancedAge.months}</div><div className="result-label">Months</div></div>
                    <div className="result-card warning"><div className="result-value">{advancedAge.days}</div><div className="result-label">Days</div></div>
                    <div className="result-card secondary"><div className="result-value">{advancedAge.totalDays.toLocaleString()}</div><div className="result-label">Total Days</div></div>
                  </div>
                </div>

                <CentralAd position="in-content" size="rectangle" />

                {showAdvanced && (
                  <div className="advanced-results">
                    <div className="advanced-section">
                      <h4 className="advanced-title"><Clock className="section-icon" />Detailed Time Breakdown</h4>
                      <div className="time-grid">
                        <div className="time-card"><div className="time-value">{advancedAge.hours}</div><div className="time-label">Hours</div></div>
                        <div className="time-card"><div className="time-value">{advancedAge.minutes}</div><div className="time-label">Minutes</div></div>
                        <div className="time-card"><div className="time-value">{advancedAge.seconds}</div><div className="time-label">Seconds</div></div>
                        <div className="time-card"><div className="time-value">{advancedAge.totalWeeks}</div><div className="time-label">Total Weeks</div></div>
                        <div className="time-card"><div className="time-value">{advancedAge.totalHours.toLocaleString()}</div><div className="time-label">Total Hours</div></div>
                        <div className="time-card"><div className="time-value">{advancedAge.ageInMonths}</div><div className="time-label">Age in Months</div></div>
                      </div>
                    </div>

                    <div className="advanced-section">
                      <h4 className="advanced-title"><Cake className="section-icon" />Birthday Information</h4>
                      {advancedAge.isBirthdayToday ? (
                        <div className="birthday-today"><div className="today-badge">🎉</div><div className="today-content"><div className="today-title">Happy Birthday! 🎂</div><div className="today-message">Today is your special day!</div></div></div>
                      ) : (
                        <div className="next-birthday">
                          <div className="next-birthday-stats"><div className="next-birthday-value">{advancedAge.daysUntilBirthday}</div><div className="next-birthday-label">days until your next birthday</div></div>
                          <div className="next-birthday-details">
                            <div className="detail-item"><span className="detail-label">Date:</span><span className="detail-value">{advancedAge.formattedNextBirthday}</span></div>
                            <div className="detail-item"><span className="detail-label">Day:</span><span className="detail-value">{advancedAge.nextBirthdayDayName}</span></div>
                            <div className="detail-item"><span className="detail-label">You will turn:</span><span className="detail-value">{advancedAge.years + 1} years old</span></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="advanced-section">
                      <h4 className="advanced-title"><Star className="section-icon" />Zodiac & Life Progress</h4>
                      <div className="zodiac-section">
                        <div className="zodiac-card"><div className="zodiac-sign">{getZodiacTranslation(advancedAge.zodiacSignKey)}</div><div className="zodiac-label">Your Zodiac Sign</div></div>
                        <div className="life-progress">
                          <div className="progress-header"><div className="progress-label">Life Progress</div><div className="progress-percent">{advancedAge.lifePercentage}%</div></div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${advancedAge.lifePercentage}%` }} /></div>
                          <div className="progress-description">You've completed {advancedAge.lifePercentage}% of the average 80-year lifespan</div>
                        </div>
                      </div>
                    </div>

                    {advancedAge.nextMilestoneKey && (
                      <div className="advanced-section">
                        <h4 className="advanced-title"><Target className="section-icon" />Next Life Milestone</h4>
                        <div className="milestone-card">
                          <div className="milestone-age">{advancedAge.years + advancedAge.yearsToNextMilestone}</div>
                          <div className="milestone-content">
                            <div className="milestone-title">{getMilestoneTranslation(advancedAge.nextMilestoneKey)}</div>
                            <div className="milestone-description">Your next major life milestone</div>
                            <div className="milestone-countdown"><span className="countdown-label">Years to go:</span><span className="countdown-value">{advancedAge.yearsToNextMilestone} years</span></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="advanced-section"><PlanetAges ageInYears={advancedAge.years} /></div>
                    {birthDate && <div className="advanced-section"><LegendsBorn birthDate={new Date(birthDate)} /></div>}
                    {birthDate && <div className="advanced-section"><RetirementCalculator birthYear={new Date(birthDate).getFullYear()} currentAge={advancedAge.years} /></div>}
                  </div>
                )}

                <div className="export-section">
                  <button onClick={copyResults} className="export-button copy" type="button">
                    {copied ? <><Check className="button-icon" /><span>Copied!</span></> : <><Copy className="button-icon" /><span>Copy Results</span></>}
                  </button>
                  <button onClick={exportAsText} className="export-button download" type="button"><Download className="button-icon" /><span>Export as Text</span></button>
                  <button onClick={() => setShowShareModal(true)} className="export-button share" type="button"><Share2 className="button-icon" /><span>Create Share Card</span></button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <aside className="calculator-sidebar-right"><CentralAd position="sidebar-right" size="skyscraper" /></aside>

      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>

      <CentralAd position="bottom" size="banner" />
    </div>
  );
}
