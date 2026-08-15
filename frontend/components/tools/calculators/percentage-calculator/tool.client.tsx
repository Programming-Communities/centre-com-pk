
// components/tools/calculators/percentage-calculator/tool.client.tsx
"use client";

import { useState, useEffect } from "react";
import { Percent, TrendingUp, TrendingDown, Target, PieChart, History, Copy, Download, Share2, CheckCircle, RefreshCw, Calculator } from "lucide-react";
import { useTheme } from '@/components/theme';

import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

import ToolContentRenderer from "@/components/tools/ToolContentRenderer";


type CalculationType = 
  | 'findPercentage' 
  | 'findNumber' 
  | 'increaseByPercent' 
  | 'decreaseByPercent' 
  | 'percentageChange';

interface HistoryEntry {
  id: number;
  calculationType: CalculationType;
  value1: number;
  value2: number;
  result: number;
  formattedResult: string;

  timestamp: string;
}

export default function PercentageCalculatorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const [mounted, setMounted] = useState(false);
  
  const [calculationType, setCalculationType] = useState<CalculationType>('findPercentage');
  const [value1, setValue1] = useState<number>(100);
  const [value2, setValue2] = useState<number>(20);
  const [result, setResult] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `percentage_calculator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('percentage-calculator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const calculateResult = () => {
    let calculatedResult = 0;
    
    switch (calculationType) {
      case 'findPercentage':
        // What is X% of Y?
        calculatedResult = (value2 * value1) / 100;
        break;
      case 'findNumber':
        // X is what percent of Y?
        calculatedResult = (value1 / value2) * 100;
        break;
      case 'increaseByPercent':
        // Increase X by Y%
        calculatedResult = value1 * (1 + value2 / 100);
        break;
      case 'decreaseByPercent':
        // Decrease X by Y%
        calculatedResult = value1 * (1 - value2 / 100);
        break;
      case 'percentageChange':
        // Percentage change from X to Y
        calculatedResult = ((value2 - value1) / value1) * 100;
        break;
    }
    
    setResult(calculatedResult);
    
    // Save to history
    const historyEntry: HistoryEntry = {
      id: Date.now(),
      calculationType,
      value1,
      value2,
      result: calculatedResult,
      formattedResult: formatResult(calculatedResult, calculationType),
      timestamp: new Date().toISOString()
    };
    
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('percentage-calculator-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  useEffect(() => {
    if (mounted) {
      calculateResult();
    }
  }, [calculationType, value1, value2, mounted]);

  const formatResult = (value: number, type: CalculationType) => {
    if (type === 'findNumber' || type === 'percentageChange') {
      return `${value.toFixed(2)}%`;
    }
    return value.toFixed(2);
  };

  const getCalculationDescription = () => {
    const descriptions = {
      findPercentage: `${value2}% ${t('of', 'of')} ${value1}`,
      findNumber: `${value1} ${t('is_what_percent_of', 'is what percent of')} ${value2}`,
      increaseByPercent: `${t('increase', 'Increase')} ${value1} ${t('by', 'by')} ${value2}%`,
      decreaseByPercent: `${t('decrease', 'Decrease')} ${value1} ${t('by', 'by')} ${value2}%`,
      percentageChange: `${t('percentage_change', 'Percentage change')} ${t('from', 'from')} ${value1} ${t('to', 'to')} ${value2}`,
    };
    return descriptions[calculationType];
  };

  const getResultDescription = () => {
    const descriptions = {
      findPercentage: `${value2}% ${t('of', 'of')} ${value1} ${t('is', 'is')}`,
      findNumber: `${value1} ${t('is', 'is')}`,
      increaseByPercent: `${value1} ${t('increased_by', 'increased by')} ${value2}% ${t('is', 'is')}`,
      decreaseByPercent: `${value1} ${t('decreased_by', 'decreased by')} ${value2}% ${t('is', 'is')}`,
      percentageChange: `${t('change', 'Change')} ${t('from', 'from')} ${value1} ${t('to', 'to')} ${value2} ${t('is', 'is')}`,
    };
    return descriptions[calculationType];
  };

  const getDetailedCalculation = () => {
    switch (calculationType) {
      case 'findPercentage':
        return `${value1} × ${value2}% = ${value1} × (${value2}/100) = ${result.toFixed(2)}`;
      case 'findNumber':
        return `(${value1} / ${value2}) × 100 = ${result.toFixed(2)}%`;
      case 'increaseByPercent':
        return `${value1} + (${value1} × ${value2}%) = ${value1} + (${value1} × ${value2}/100) = ${result.toFixed(2)}`;
      case 'decreaseByPercent':
        return `${value1} - (${value1} × ${value2}%) = ${value1} - (${value1} × ${value2}/100) = ${result.toFixed(2)}`;
      case 'percentageChange':
        return `((${value2} - ${value1}) / ${value1}) × 100 = ${result.toFixed(2)}%`;
    }
  };

  const copyResults = () => {
    const text = `${getResultDescription()} ${formatResult(result, calculationType)}\n\n` +
                 `${t('calculation', 'Calculation')}: ${getDetailedCalculation()}\n` +
                 `${t('generated_by', 'Generated by Centre.com.pk Percentage Calculator')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== PERCENTAGE CALCULATION REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n\n` +
                 `${t('calculation_type', 'Calculation Type')}: ${t(calculationType, calculationType)}\n` +
                 `${t('input_values', 'Input Values')}:\n` +
                 `• ${t('value_1', 'Value 1')}: ${value1}\n` +
                 `• ${t('value_2', 'Value 2')}: ${value2}\n\n` +
                 `${t('result', 'Result')}: ${formatResult(result, calculationType)}\n\n` +
                 `${t('calculation_details', 'Calculation Details')}:\n${getDetailedCalculation()}\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk Percentage Calculator ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `percentage-calculation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${getResultDescription()} ${formatResult(result, calculationType)}`;
    
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Percentage Calculation Result'),
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
      localStorage.removeItem('percentage-calculator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setCalculationType(entry.calculationType);
    setValue1(entry.value1);
    setValue2(entry.value2);
    setActiveTab('calculator');
  };

  const calculationTypes = [
    {
      id: 'findPercentage' as CalculationType,
      name: t('find_percentage', 'Find Percentage'),
      description: t('find_percentage_desc', 'What is X% of Y?'),
      icon: Percent
    },
    {
      id: 'findNumber' as CalculationType,
      name: t('find_number', 'Find Number'),
      description: t('find_number_desc', 'X is what % of Y?'),
      icon: Target
    },
    {
      id: 'increaseByPercent' as CalculationType,
      name: t('increase_by', 'Increase by %'),
      description: t('increase_by_desc', 'Increase X by Y%'),
      icon: TrendingUp
    },
    {
      id: 'decreaseByPercent' as CalculationType,
      name: t('decrease_by', 'Decrease by %'),
      description: t('decrease_by_desc', 'Decrease X by Y%'),
      icon: TrendingDown
    },
    {
      id: 'percentageChange' as CalculationType,
      name: t('percentage_change', '% Change'),
      description: t('percentage_change_desc', '% change from X to Y'),
      icon: PieChart
    },
  ];

  const quickCalculations = [
    { label: '10% of 100', value1: 100, value2: 10, type: 'findPercentage' as CalculationType },
    { label: '50 to 100', value1: 50, value2: 100, type: 'percentageChange' as CalculationType },
    { label: '100 + 20%', value1: 100, value2: 20, type: 'increaseByPercent' as CalculationType },
    { label: '100 - 15%', value1: 100, value2: 15, type: 'decreaseByPercent' as CalculationType },
    { label: '25% of 200', value1: 200, value2: 25, type: 'findPercentage' as CalculationType },
    { label: '75 to 150', value1: 75, value2: 150, type: 'percentageChange' as CalculationType },
  ];

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
              <Percent className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Percentage Calculator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Calculate percentages, increases, decreases, and more')}
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
                {/* Calculation Type Selection */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Percent className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('calculation_type', 'Calculation Type')}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {calculationTypes.map((type) => {
                      const Icon = type.icon;
                      const isActive = calculationType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setCalculationType(type.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${isActive ? 'scale-102' : 'hover:scale-101'}`}
                          style={{ 
                            borderColor: isActive ? themeColors.primary : themeColors.border,
                            backgroundColor: isActive ? `${themeColors.primary}10` : themeColors.background
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" style={{ color: isActive ? themeColors.primary : themeColors.text.secondary }} />
                            <div className="text-left">
                              <div className="font-semibold" style={{ color: isActive ? themeColors.primary : themeColors.text.primary }}>
                                {type.name}
                              </div>
                              <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                                {type.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Values */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('input_values', 'Input Values')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {calculationType === 'percentageChange' ? t('original_value', 'Original Value') : t('value_1', 'Value 1')}
                      </label>
                      <input
                        type="number"
                        value={value1}
                        onChange={(e) => setValue1(Number(e.target.value))}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        style={{
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary
                        }}
                        step="any"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {calculationType === 'percentageChange' ? t('new_value', 'New Value') : t('value_2', 'Value 2')}
                        {calculationType !== 'percentageChange' && calculationType !== 'findNumber' && (
                          <span className="ml-1">(%)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        value={value2}
                        onChange={(e) => setValue2(Number(e.target.value))}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        style={{
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary
                        }}
                        step="any"
                      />
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('result', 'Result')}
                  </h2>
                  
                  <div 
                    className="p-4 rounded-lg mb-4"
                    style={{ 
                      backgroundColor: `${themeColors.primary}10`,
                      border: `1px solid ${themeColors.primary}30`
                    }}
                  >
                    <p className="text-sm mb-2" style={{ color: themeColors.primary }}>
                      {t('problem', 'Problem')}:
                    </p>
                    <p className="font-semibold text-lg" style={{ color: themeColors.text.primary }}>
                      {getCalculationDescription()}
                    </p>
                  </div>

                  <div 
                    className="p-4 rounded-lg mb-4"
                    style={{ 
                      backgroundColor: `${themeColors.success}10`,
                      border: `1px solid ${themeColors.success}30`
                    }}
                  >
                    <p className="text-sm mb-2" style={{ color: themeColors.success }}>
                      {t('solution', 'Solution')}:
                    </p>
                    <p className="font-semibold text-lg" style={{ color: themeColors.text.primary }}>
                      {getResultDescription()} <span className="text-2xl" style={{ color: themeColors.primary }}>{formatResult(result, calculationType)}</span>
                    </p>
                  </div>

                  {/* Detailed Calculation */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: themeColors.background,
                      border: `1px solid ${themeColors.border}`
                    }}
                  >
                    <p className="text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                      {t('calculation_details', 'Calculation Details')}:
                    </p>
                    <p className="text-sm font-mono" style={{ color: themeColors.text.secondary }}>
                      {getDetailedCalculation()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
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
                        {t('recent_calculations', 'Your recent percentage calculations')}
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
                    {history.map((entry) => {
                      const typeInfo = calculationTypes.find(t => t.id === entry.calculationType);
                      const Icon = typeInfo?.icon || Percent;
                      return (
                        <div key={entry.id} className="p-4 hover:opacity-80 transition-opacity">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-4 w-4" style={{ color: themeColors.primary }} />
                                <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                  {typeInfo?.name || entry.calculationType}
                                </span>
                              </div>
                              <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                                {entry.value1} → {entry.value2} = {entry.formattedResult}
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No calculation history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your percentage calculations will appear here')}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {quickCalculations.map((quick, index) => (
              <button
                key={index}
                onClick={() => {
                  setCalculationType(quick.type);
                  setValue1(quick.value1);
                  setValue2(quick.value2);
                }}
                className="px-3 py-2 rounded-lg hover:opacity-80 transition-colors text-sm text-center"
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
                {quick.label}
              </button>
            ))}
          </div>
        </div>

        {/* Percentage Tips */}
        <div 
          className="mt-6 rounded-xl p-6"
          style={{ 
            backgroundColor: `${themeColors.primary}10`,
            border: `1px solid ${themeColors.primary}30`
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
            {t('percentage_tips', 'Percentage Tips')}
          </h3>
          <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
            <li>{t('tip_1', 'To find 10% of a number, simply move the decimal point one place to the left')}</li>
            <li>{t('tip_2', 'To increase a number by 15%, multiply it by 1.15')}</li>
            <li>{t('tip_3', 'To decrease a number by 20%, multiply it by 0.80')}</li>
            <li>{t('tip_4', 'Percentage change = [(New - Original) / Original] × 100')}</li>
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
