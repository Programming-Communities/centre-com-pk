
// components/tools/calculators/tip-calculator/tool.client.tsx
"use client";

import { useState, useEffect } from "react";
import { Receipt, Users, Percent, DollarSign, History, Copy, Download, Share2, CheckCircle, RefreshCw, Calculator, TrendingUp } from "lucide-react";
import { useTheme } from '@/components/theme';

import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

import ToolContentRenderer from "@/components/tools/ToolContentRenderer";


interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
  tipPerPerson: number;
}

interface HistoryEntry {
  id: number;
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  taxAmount: number;
  result: TipResult;

  timestamp: string;
}

export default function TipCalculatorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const [mounted, setMounted] = useState(false);
  
  const [billAmount, setBillAmount] = useState<number>(100);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [result, setResult] = useState<TipResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [customTip, setCustomTip] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [roundUp, setRoundUp] = useState(false);
  const [serviceQuality, setServiceQuality] = useState<'poor' | 'average' | 'good' | 'excellent' | null>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `tip_calculator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('tip-calculator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const calculateTip = () => {
    const tip = billAmount * (tipPercentage / 100);
    const total = billAmount + tip + taxAmount;
    let perPerson = total / numberOfPeople;
    let tipPerPerson = tip / numberOfPeople;
    
    if (roundUp && numberOfPeople > 1) {
      const roundedTotal = Math.ceil(perPerson * numberOfPeople);
      perPerson = roundedTotal / numberOfPeople;
      tipPerPerson = (roundedTotal - billAmount - taxAmount) / numberOfPeople;
    }
    
    const newResult = {
      tipAmount: tip,
      totalAmount: total,
      perPerson: perPerson,
      tipPerPerson: tipPerPerson
    };
    
    setResult(newResult);
    
    // Save to history
    const historyEntry: HistoryEntry = {
      id: Date.now(),
      billAmount,
      tipPercentage,
      numberOfPeople,
      taxAmount,
      result: newResult,
      timestamp: new Date().toISOString()
    };
    
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('tip-calculator-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  useEffect(() => {
    if (mounted) {
      calculateTip();
    }
  }, [billAmount, tipPercentage, numberOfPeople, taxAmount, roundUp, mounted]);

  const formatCurrency = (amount: number) => {
    const locale = lang === 'ur' || lang === 'ar' ? 'en-US' : 
                   lang === 'hi' ? 'en-IN' : 'en-US';
    const currency = lang === 'hi' ? 'INR' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const applyServiceQuality = (quality: 'poor' | 'average' | 'good' | 'excellent') => {
    setServiceQuality(quality);
    let newTip = tipPercentage;
    switch(quality) {
      case 'poor':
        newTip = 10;
        break;
      case 'average':
        newTip = 15;
        break;
      case 'good':
        newTip = 18;
        break;
      case 'excellent':
        newTip = 20;
        break;
    }
    setTipPercentage(newTip);
    setCustomTip(newTip);
  };

  const quickTipPercentages = [10, 15, 18, 20, 25];

  const copyResults = () => {
    if (!result) return;
    
    const text = `${t('bill_summary', 'Bill Summary')}:\n` +
                 `${t('bill_amount', 'Bill Amount')}: ${formatCurrency(billAmount)}\n` +
                 (taxAmount > 0 ? `${t('tax', 'Tax')}: ${formatCurrency(taxAmount)}\n` : '') +
                 `${t('tip', 'Tip')} (${tipPercentage}%): ${formatCurrency(result.tipAmount)}\n` +
                 `${t('total_amount', 'Total Amount')}: ${formatCurrency(result.totalAmount)}\n` +
                 (numberOfPeople > 1 ? `${t('per_person', 'Per Person')}: ${formatCurrency(result.perPerson)}\n` : '') +
                 `\n${t('generated_by', 'Generated by Centre.com.pk Tip Calculator')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    if (!result) return;
    
    const text = `${t('export_header', '=== TIP CALCULATION REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n\n` +
                 `${t('bill_details', 'Bill Details')}:\n` +
                 `• ${t('bill_amount', 'Bill Amount')}: ${formatCurrency(billAmount)}\n` +
                 (taxAmount > 0 ? `• ${t('tax', 'Tax')}: ${formatCurrency(taxAmount)}\n` : '') +
                 `• ${t('tip_percentage', 'Tip Percentage')}: ${tipPercentage}%\n` +
                 `• ${t('number_of_people', 'Number of People')}: ${numberOfPeople}\n\n` +
                 `${t('results', 'Results')}:\n` +
                 `• ${t('tip_amount', 'Tip Amount')}: ${formatCurrency(result.tipAmount)}\n` +
                 `• ${t('total_amount', 'Total Amount')}: ${formatCurrency(result.totalAmount)}\n` +
                 (numberOfPeople > 1 ? `• ${t('per_person', 'Per Person')}: ${formatCurrency(result.perPerson)}\n` : '') +
                 (numberOfPeople > 1 ? `• ${t('tip_per_person', 'Tip Per Person')}: ${formatCurrency(result.tipPerPerson)}\n` : '') +
                 `\n${t('generated_by', '=== Generated by Centre.com.pk Tip Calculator ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tip-calculation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (!result) return;
    
    const shareText = `${t('bill_total', 'Bill Total')}: ${formatCurrency(result.totalAmount)} | ${t('tip', 'Tip')}: ${formatCurrency(result.tipAmount)} (${tipPercentage}%)`;
    
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Tip Calculation Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('tip-calculator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setBillAmount(entry.billAmount);
    setTipPercentage(entry.tipPercentage);
    setNumberOfPeople(entry.numberOfPeople);
    setTaxAmount(entry.taxAmount);
    setActiveTab('calculator');
  };

  const resetCalculator = () => {
    setBillAmount(100);
    setTipPercentage(15);
    setNumberOfPeople(1);
    setTaxAmount(0);
    setRoundUp(false);
    setCustomTip(null);
    setServiceQuality(null);
  };

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
              <Receipt className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Tip Calculator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Calculate tips and split bills with friends')}
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
            <Calculator className="h-4 w-4" />
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
                {/* Service Quality Quick Select */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <p className="text-sm font-medium mb-3" style={{ color: themeColors.text.secondary }}>
                    {t('service_quality', 'Service Quality')}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['poor', 'average', 'good', 'excellent'] as const).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => applyServiceQuality(quality)}
                        className={`py-2 rounded-lg text-sm transition-all ${serviceQuality === quality ? 'scale-105' : 'hover:scale-102'}`}
                        style={{ 
                          backgroundColor: serviceQuality === quality ? themeColors.primary : themeColors.background,
                          color: serviceQuality === quality ? themeColors.text.accent : themeColors.text.primary,
                          border: `1px solid ${serviceQuality === quality ? 'transparent' : themeColors.border}`
                        }}
                      >
                        {t(quality, quality)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Section */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Receipt className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('bill_details', 'Bill Details')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('bill_amount', 'Bill Amount')}
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                        <input
                          type="number"
                          value={billAmount}
                          onChange={(e) => setBillAmount(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('tax_amount', 'Tax Amount')} ({t('optional', 'Optional')})
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                        <input
                          type="number"
                          value={taxAmount}
                          onChange={(e) => setTaxAmount(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('tip_percentage', 'Tip Percentage')}: {tipPercentage}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={tipPercentage}
                        onChange={(e) => {
                          setTipPercentage(Number(e.target.value));
                          setCustomTip(Number(e.target.value));
                          setServiceQuality(null);
                        }}
                        className="w-full"
                        style={{
                          accentColor: themeColors.primary
                        }}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {quickTipPercentages.map(percent => (
                          <button
                            key={percent}
                            onClick={() => {
                              setTipPercentage(percent);
                              setCustomTip(percent);
                              setServiceQuality(null);
                            }}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              tipPercentage === percent && !serviceQuality
                                ? 'text-white'
                                : 'text-text-secondary hover:opacity-80'
                            }`}
                            style={{ 
                              backgroundColor: tipPercentage === percent && !serviceQuality ? themeColors.primary : themeColors.background,
                              border: `1px solid ${themeColors.border}`
                            }}
                          >
                            {percent}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('split_between', 'Split Between')}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                        <input
                          type="number"
                          value={numberOfPeople}
                          onChange={(e) => setNumberOfPeople(Math.max(1, Number(e.target.value)))}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          min="1"
                        />
                      </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full py-2 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                      style={{ color: themeColors.primary }}
                    >
                      {showAdvanced ? '▼' : '▶'} {showAdvanced ? t('hide_advanced', 'Hide Advanced Options') : t('show_advanced', 'Show Advanced Options')}
                    </button>

                    {showAdvanced && (
                      <div className="p-4 rounded-lg border" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={roundUp}
                            onChange={(e) => setRoundUp(e.target.checked)}
                            className="rounded"
                            style={{ accentColor: themeColors.primary }}
                          />
                          <span className="text-sm" style={{ color: themeColors.text.primary }}>
                            {t('round_up_total', 'Round up total per person')}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Section */}
                {result && (
                  <>
                    <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                        {t('tip_summary', 'Tip Summary')}
                      </h2>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span style={{ color: themeColors.text.secondary }}>{t('bill_amount', 'Bill Amount')}:</span>
                          <span className="font-semibold" style={{ color: themeColors.text.primary }}>{formatCurrency(billAmount)}</span>
                        </div>
                        {taxAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span style={{ color: themeColors.text.secondary }}>{t('tax', 'Tax')}:</span>
                            <span className="font-semibold" style={{ color: themeColors.text.primary }}>{formatCurrency(taxAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span style={{ color: themeColors.text.secondary }}>{t('tip', 'Tip')} ({tipPercentage}%):</span>
                          <span className="font-semibold" style={{ color: themeColors.success }}>{formatCurrency(result.tipAmount)}</span>
                        </div>
                        <div className="border-t pt-2" style={{ borderColor: themeColors.border }}>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('total_amount', 'Total Amount')}:</span>
                            <span className="text-xl font-bold" style={{ color: themeColors.primary }}>{formatCurrency(result.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {numberOfPeople > 1 && (
                      <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                          <Users className="h-5 w-5" style={{ color: themeColors.primary }} />
                          {t('split_bill', 'Split Bill')}
                        </h2>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span style={{ color: themeColors.text.secondary }}>{t('each_person_pays', 'Each person pays')}:</span>
                            <span className="text-lg font-bold" style={{ color: themeColors.success }}>
                              {formatCurrency(result.perPerson)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span style={{ color: themeColors.text.secondary }}>
                              ({t('including', 'including')} {formatCurrency(result.tipPerPerson)} {t('tip_each', 'tip each')})
                            </span>
                          </div>
                          {roundUp && (
                            <div className="text-xs mt-2" style={{ color: themeColors.warning }}>
                              {t('rounded_up', 'Total rounded up for easier payment')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={copyResults}
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
                        onClick={shareResults}
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

                    {/* Reset Button */}
                    <button
                      onClick={resetCalculator}
                      className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                      style={{ 
                        backgroundColor: themeColors.background,
                        border: `1px solid ${themeColors.border}`,
                        color: themeColors.text.secondary
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('reset', 'Reset All')}
                    </button>

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />
                  </>
                )}
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
                        {t('recent_calculations', 'Your recent tip calculations')}
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
                              <Receipt className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {formatCurrency(entry.billAmount)} @ {entry.tipPercentage}%
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                              {t('total', 'Total')}: {formatCurrency(entry.result.totalAmount)} | 
                              {entry.numberOfPeople > 1 ? ` ${t('each', 'each')}: ${formatCurrency(entry.result.perPerson)}` : ''}
                            </p>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => loadHistoryEntry(entry)}
                            className="px-3 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: themeColors.primary,
                              color: themeColors.text.accent
                            }}
                          >
                            {t('load', 'Load')}
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
                      {t('history_will_appear', 'Your tip calculations will appear here')}
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

        {/* Quick Calculations */}
        <div className="mt-8 rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
            {t('quick_calculations', 'Quick Calculations')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { amount: 50, people: 2, tip: 15, label: '$50 Bill' },
              { amount: 75, people: 3, tip: 18, label: '$75 Bill' },
              { amount: 100, people: 4, tip: 20, label: '$100 Bill' },
              { amount: 150, people: 5, tip: 15, label: '$150 Bill' },
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setBillAmount(preset.amount);
                  setNumberOfPeople(preset.people);
                  setTipPercentage(preset.tip);
                  setTaxAmount(0);
                  setServiceQuality(null);
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
                <div className="font-semibold">{preset.label}</div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  {preset.tip}% tip, {preset.people} {preset.people === 1 ? 'person' : 'people'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tip Guidelines */}
        <div 
          className="mt-6 rounded-xl p-6"
          style={{ 
            backgroundColor: `${themeColors.primary}10`,
            border: `1px solid ${themeColors.primary}30`
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
            {t('tip_guidelines', 'Tip Guidelines')}
          </h3>
          <ul className="text-sm space-y-1" style={{ color: themeColors.primary }}>
            <li>• 10% - {t('poor_service', 'Poor service')}</li>
            <li>• 15% - {t('standard_service', 'Standard service')}</li>
            <li>• 18% - {t('good_service', 'Good service')}</li>
            <li>• 20% - {t('excellent_service', 'Excellent service')}</li>
            <li>• 25% - {t('outstanding_service', 'Outstanding service')}</li>
          </ul>
        </div>
        
        {/* Bottom Ad */}
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
      </div>
    </div>
  );

}
