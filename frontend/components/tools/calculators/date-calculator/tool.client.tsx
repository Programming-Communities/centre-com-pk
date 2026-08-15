
// components/tools/calculators/date-calculator/tool.client.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Minus, ArrowRight, History, Copy, Download, Share2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from '@/components/theme';

import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

import ToolContentRenderer from "@/components/tools/ToolContentRenderer";

type CalculationType = 'difference' | 'add' | 'subtract';

// History entry interface
interface HistoryEntry {
  id: number;
  type: CalculationType;
  date1: string;
  date2?: string;
  days?: number;
  result: string;

  timestamp: string;
}

export default function DateCalculatorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const [mounted, setMounted] = useState(false);
  
  const [calculationType, setCalculationType] = useState<CalculationType>('difference');
  const [date1, setDate1] = useState<string>(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState<string>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [daysToAdd, setDaysToAdd] = useState<number>(7);
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  // Translation helper for date calculator
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `date_calculator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('date-calculator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const calculateDate = () => {
    const d1 = new Date(date1);
    let newResult = '';
    
    switch (calculationType) {
      case 'difference':
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);
        const diffYears = Math.floor(diffDays / 365.25);
        
        newResult = `${diffDays} ${t('days', 'days')}`;
        
        if (diffWeeks > 0) newResult += ` (${diffWeeks} ${t('weeks', 'weeks')})`;
        if (diffMonths > 0) newResult += ` • ${diffMonths} ${t('months', 'months')}`;
        if (diffYears > 0) newResult += ` • ${diffYears} ${t('years', 'years')}`;
        
        setResult(newResult);
        
        // Save to history
        const historyEntry: HistoryEntry = {
          id: Date.now(),
          type: 'difference',
          date1,
          date2,
          result: `${diffDays} days between ${new Date(date1).toLocaleDateString()} and ${new Date(date2).toLocaleDateString()}`,
          timestamp: new Date().toISOString()
        };
        updateHistory(historyEntry);
        break;

      case 'add':
        const newDateAdd = new Date(d1);
        newDateAdd.setDate(newDateAdd.getDate() + daysToAdd);
        newResult = newDateAdd.toLocaleDateString(lang === 'ur' || lang === 'ar' ? 'ur-PK' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setResult(newResult);
        
        const addEntry: HistoryEntry = {
          id: Date.now(),
          type: 'add',
          date1,
          days: daysToAdd,
          result: `${new Date(date1).toLocaleDateString()} + ${daysToAdd} days = ${newResult}`,
          timestamp: new Date().toISOString()
        };
        updateHistory(addEntry);
        break;

      case 'subtract':
        const newDateSubtract = new Date(d1);
        newDateSubtract.setDate(newDateSubtract.getDate() - daysToAdd);
        newResult = newDateSubtract.toLocaleDateString(lang === 'ur' || lang === 'ar' ? 'ur-PK' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setResult(newResult);
        
        const subEntry: HistoryEntry = {
          id: Date.now(),
          type: 'subtract',
          date1,
          days: daysToAdd,
          result: `${new Date(date1).toLocaleDateString()} - ${daysToAdd} days = ${newResult}`,
          timestamp: new Date().toISOString()
        };
        updateHistory(subEntry);
        break;
    }
  };

  const updateHistory = (entry: HistoryEntry) => {
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('date-calculator-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('date-calculator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportAsText = () => {
    if (!result) return;
    
    const text = `${t('export_header', '=== DATE CALCULATION REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('calculation_type', 'Calculation Type')}: ${calculationType === 'difference' ? t('date_difference', 'Date Difference') : calculationType === 'add' ? t('add_days', 'Add Days') : t('subtract_days', 'Subtract Days')}\n` +
                 `${t('result', 'Result')}: ${result}\n` +
                 `\n${t('generated_by', '=== Generated by Centre.com.pk Date Calculator ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `date-calculation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResult = () => {
    if (!result) return;
    
    const shareText = `${t('share_text', 'Date calculation result')}: ${result}`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Date Calculation Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  useEffect(() => {
    if (mounted) {
      calculateDate();
    }
  }, [calculationType, date1, date2, daysToAdd, mounted]);

  const quickPresets = [1, 7, 30, 90, 365];

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ 
        backgroundColor: themeColors.background,
        color: themeColors.text.primary,
        fontFamily: fontFamily
      }}
    >
      {/* Top Banner Ad */}
      <CentralAd position="top" size="banner" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">

        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Calendar className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Date Calculator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Calculate date differences and perform date arithmetic')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'calculator' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'calculator' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'calculator' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'calculator' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Calendar className="h-4 w-4" />
            {t('tab_calculator', 'Calculator')}
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'history' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'history' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'history' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <History className="h-4 w-4" />
            {t('tab_history', 'History')}
          </button>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-left" size="skyscraper" />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {/* Calculator Tab */}
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                {/* Calculation Type Selection */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Calendar className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('calculation_type', 'Calculation Type')}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setCalculationType('difference')}
                      className={`p-4 rounded-lg border-2 transition-all ${calculationType === 'difference' ? 'scale-105' : 'hover:scale-102'}`}
                      style={{ 
                        borderColor: calculationType === 'difference' ? themeColors.primary : themeColors.border,
                        backgroundColor: calculationType === 'difference' ? `${themeColors.primary}10` : themeColors.background
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ArrowRight className="h-6 w-6" style={{ color: calculationType === 'difference' ? themeColors.primary : themeColors.text.secondary }} />
                        <div className="font-semibold">{t('date_difference', 'Date Difference')}</div>
                        <div className="text-xs opacity-75 text-center">{t('days_between', 'Days between dates')}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCalculationType('add')}
                      className={`p-4 rounded-lg border-2 transition-all ${calculationType === 'add' ? 'scale-105' : 'hover:scale-102'}`}
                      style={{ 
                        borderColor: calculationType === 'add' ? themeColors.primary : themeColors.border,
                        backgroundColor: calculationType === 'add' ? `${themeColors.primary}10` : themeColors.background
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Plus className="h-6 w-6" style={{ color: calculationType === 'add' ? themeColors.primary : themeColors.text.secondary }} />
                        <div className="font-semibold">{t('add_days', 'Add Days')}</div>
                        <div className="text-xs opacity-75 text-center">{t('add_to_date', 'Add to date')}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCalculationType('subtract')}
                      className={`p-4 rounded-lg border-2 transition-all ${calculationType === 'subtract' ? 'scale-105' : 'hover:scale-102'}`}
                      style={{ 
                        borderColor: calculationType === 'subtract' ? themeColors.primary : themeColors.border,
                        backgroundColor: calculationType === 'subtract' ? `${themeColors.primary}10` : themeColors.background
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Minus className="h-6 w-6" style={{ color: calculationType === 'subtract' ? themeColors.primary : themeColors.text.secondary }} />
                        <div className="font-semibold">{t('subtract_days', 'Subtract Days')}</div>
                        <div className="text-xs opacity-75 text-center">{t('subtract_from_date', 'Subtract from date')}</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Input Section */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {calculationType === 'difference' ? t('date_difference', 'Date Difference') : 
                     calculationType === 'add' ? t('add_days_to_date', 'Add Days to Date') : t('subtract_days_from_date', 'Subtract Days from Date')}
                  </h2>

                  <div className="space-y-4">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('start_date', 'Start Date')}
                      </label>
                      <input
                        type="date"
                        value={date1}
                        onChange={(e) => setDate1(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        style={{
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary
                        }}
                      />
                    </div>

                    {/* Date Difference Inputs */}
                    {calculationType === 'difference' && (
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                          {t('end_date', 'End Date')}
                        </label>
                        <input
                          type="date"
                          value={date2}
                          onChange={(e) => setDate2(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                        />
                      </div>
                    )}

                    {/* Add/Subtract Days Input */}
                    {(calculationType === 'add' || calculationType === 'subtract') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                            {t('number_of_days', 'Number of Days')}
                          </label>
                          <input
                            type="number"
                            value={daysToAdd}
                            onChange={(e) => setDaysToAdd(Number(e.target.value))}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            style={{
                              borderColor: themeColors.border,
                              backgroundColor: themeColors.background,
                              color: themeColors.text.primary
                            }}
                            min="1"
                          />
                        </div>

                        {/* Quick Presets */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                            {t('quick_presets', 'Quick Presets')}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {quickPresets.map(days => (
                              <button
                                key={days}
                                onClick={() => setDaysToAdd(days)}
                                className="px-3 py-2 rounded-lg hover:opacity-80 transition-colors text-sm"
                                style={{ 
                                  backgroundColor: themeColors.background,
                                  color: themeColors.text.primary,
                                  border: `1px solid ${themeColors.border}`
                                }}
                              >
                                +{days} {t('days', 'days')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Results Section */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('result', 'Result')}
                  </h2>
                  
                  <div 
                    className="p-4 rounded-lg text-center mb-4"
                    style={{ 
                      backgroundColor: `${themeColors.primary}10`,
                      border: `1px solid ${themeColors.primary}30`
                    }}
                  >
                    <p className="font-semibold text-lg" style={{ color: themeColors.primary }}>
                      {result || t('enter_values', 'Enter values to calculate')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {result && (
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={copyResult}
                        className="py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                        style={{ 
                          backgroundColor: themeColors.background,
                          border: `1px solid ${themeColors.border}`,
                          color: themeColors.text.secondary
                        }}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? t('copied', 'Copied!') : t('copy', 'Copy')}
                      </button>
                      
                      <button
                        onClick={exportAsText}
                        className="py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                        style={{ 
                          backgroundColor: themeColors.background,
                          border: `1px solid ${themeColors.border}`,
                          color: themeColors.text.secondary
                        }}
                      >
                        <Download className="h-4 w-4" />
                        {t('export', 'Export')}
                      </button>
                      
                      <button
                        onClick={shareResult}
                        className="py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                        style={{ 
                          backgroundColor: themeColors.background,
                          border: `1px solid ${themeColors.border}`,
                          color: themeColors.text.secondary
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        {t('share', 'Share')}
                      </button>
                    </div>
                  )}

                  {/* Detailed Breakdown for Date Difference */}
                  {calculationType === 'difference' && result && (
                    <div 
                      className="mt-4 p-3 rounded-lg text-sm"
                      style={{ 
                        backgroundColor: `${themeColors.success}10`,
                        border: `1px solid ${themeColors.success}30`
                      }}
                    >
                      <p className="font-medium mb-1" style={{ color: themeColors.success }}>
                        {t('breakdown', 'Breakdown')}:
                      </p>
                      <p style={{ color: themeColors.text.secondary }}>
                        {t('from', 'From')} {new Date(date1).toLocaleDateString()} {t('to', 'to')} {new Date(date2).toLocaleDateString()}
                      </p>
                      <p style={{ color: themeColors.text.secondary }}>
                        {t('total_difference', 'Total difference')}: {result}
                      </p>
                    </div>
                  )}
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('calculation_history', 'Calculation History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_calculations', 'Your recent date calculations')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ 
                          borderColor: themeColors.error,
                          color: themeColors.error
                        }}
                      >
                        {t('clear_history', 'Clear History')}
                      </button>
                    )}
                  </div>
                </div>

                {history.length > 0 ? (
                  <div className="divide-y" style={{ borderColor: themeColors.border }}>
                    {history.map((entry) => (
                      <div key={entry.id} className="p-4 hover:opacity-80 transition-opacity">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {entry.type === 'difference' && <ArrowRight className="h-4 w-4" style={{ color: themeColors.primary }} />}
                              {entry.type === 'add' && <Plus className="h-4 w-4" style={{ color: themeColors.success }} />}
                              {entry.type === 'subtract' && <Minus className="h-4 w-4" style={{ color: themeColors.warning }} />}
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.type === 'difference' ? t('date_difference', 'Date Difference') : 
                                 entry.type === 'add' ? t('add_days', 'Add Days') : t('subtract_days', 'Subtract Days')}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                              {entry.result}
                            </p>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (entry.type === 'difference') {
                                setCalculationType('difference');
                                setDate1(entry.date1);
                                setDate2(entry.date2 || '');
                              } else {
                                setCalculationType(entry.type);
                                setDate1(entry.date1);
                                setDaysToAdd(entry.days || 7);
                              }
                              setActiveTab('calculator');
                            }}
                            className="px-3 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: themeColors.primary,
                              color: themeColors.text.accent
                            }}
                          >
                            {t('recalculate', 'Recalculate')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No calculation history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your date calculations will appear here')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-right" size="skyscraper" />
            </div>
          </aside>
        </div>

        {/* Quick Date Calculations */}
        <div className="mt-8 rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
            {t('quick_calculations', 'Quick Date Calculations')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('today_1_week', 'Today + 1 week'), days: 7 },
              { label: t('today_1_month', 'Today + 1 month'), days: 30 },
              { label: t('today_3_months', 'Today + 3 months'), days: 90 },
              { label: t('today_1_year', 'Today + 1 year'), days: 365 },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setCalculationType('add');
                  setDate1(new Date().toISOString().split('T')[0]);
                  setDaysToAdd(item.days);
                  setActiveTab('calculator');
                }}
                className="p-4 rounded-lg hover:opacity-80 transition-colors text-center"
                style={{ 
                  backgroundColor: themeColors.background,
                  color: themeColors.text.primary,
                  border: `1px solid ${themeColors.border}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = themeColors.primary;
                  e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.backgroundColor = themeColors.background;
                }}
              >
                <div className="font-semibold text-sm">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Bottom Ad */}
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
      </div>
    </div>
  );

}
