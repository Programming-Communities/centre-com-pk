
// components/tools/calculators/loan-calculator/tool.client.tsx
"use client";

import { useState, useEffect } from "react";
import { Calculator, DollarSign, Calendar, TrendingUp, History, Copy, Download, Share2, CheckCircle, RefreshCw, ChevronDown, ChevronUp, PieChart } from "lucide-react";
import { useTheme } from '@/components/theme';

import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

interface HistoryEntry {
  id: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  result: LoanResult;

  timestamp: string;
}

export default function LoanCalculatorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const [mounted, setMounted] = useState(false);
  
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'amortization' | 'history'>('calculator');
  const [showChart, setShowChart] = useState(false);
  const [quickPreset, setQuickPreset] = useState<'car' | 'mortgage' | 'personal' | null>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `loan_calculator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('loan-calculator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
    // Initial calculation
    calculateLoan();
  }, []);

  const calculateLoan = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment = 
        principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const amortization = [];
    let balance = principal;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      const principalPayment = monthlyPayment - interest;
      balance -= principalPayment;

      amortization.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest,
        balance: Math.max(0, balance)
      });
    }

    const newResult = {
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortization
    };
    
    setResult(newResult);
    
    // Save to history
    const historyEntry: HistoryEntry = {
      id: Date.now(),
      loanAmount,
      interestRate,
      loanTerm,
      result: newResult,
      timestamp: new Date().toISOString()
    };
    
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('loan-calculator-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

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

  const copyResults = () => {
    if (!result) return;
    
    const text = `${t('loan_summary', 'Loan Summary')}:\n` +
                 `${t('loan_amount', 'Loan Amount')}: ${formatCurrency(loanAmount)}\n` +
                 `${t('interest_rate', 'Interest Rate')}: ${interestRate}%\n` +
                 `${t('loan_term', 'Loan Term')}: ${loanTerm} ${t('years', 'years')}\n` +
                 `${t('monthly_payment', 'Monthly Payment')}: ${formatCurrency(result.monthlyPayment)}\n` +
                 `${t('total_payment', 'Total Payment')}: ${formatCurrency(result.totalPayment)}\n` +
                 `${t('total_interest', 'Total Interest')}: ${formatCurrency(result.totalInterest)}\n` +
                 `\n${t('generated_by', 'Generated by Centre.com.pk Loan Calculator')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    if (!result) return;
    
    let text = `${t('export_header', '=== LOAN CALCULATION REPORT ===')}\n` +
               `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n\n` +
               `${t('loan_details', 'Loan Details')}:\n` +
               `• ${t('loan_amount', 'Loan Amount')}: ${formatCurrency(loanAmount)}\n` +
               `• ${t('interest_rate', 'Interest Rate')}: ${interestRate}%\n` +
               `• ${t('loan_term', 'Loan Term')}: ${loanTerm} ${t('years', 'years')}\n\n` +
               `${t('summary', 'Summary')}:\n` +
               `• ${t('monthly_payment', 'Monthly Payment')}: ${formatCurrency(result.monthlyPayment)}\n` +
               `• ${t('total_payment', 'Total Payment')}: ${formatCurrency(result.totalPayment)}\n` +
               `• ${t('total_interest', 'Total Interest')}: ${formatCurrency(result.totalInterest)}\n\n` +
               `${t('amortization_schedule', 'Amortization Schedule')} (First 12 months):\n`;
    
    result.amortization.slice(0, 12).forEach(row => {
      text += `${t('month', 'Month')} ${row.month}: ${t('payment', 'Payment')} ${formatCurrency(row.payment)} | ` +
              `${t('principal', 'Principal')} ${formatCurrency(row.principal)} | ` +
              `${t('interest', 'Interest')} ${formatCurrency(row.interest)} | ` +
              `${t('balance', 'Balance')} ${formatCurrency(row.balance)}\n`;
    });
    
    text += `\n${t('generated_by', '=== Generated by Centre.com.pk Loan Calculator ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-calculation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (!result) return;
    
    const shareText = `${t('loan_calculation', 'Loan Calculation')}: ${formatCurrency(loanAmount)} @ ${interestRate}% for ${loanTerm} ${t('years', 'years')} = ${t('monthly', 'Monthly')} ${formatCurrency(result.monthlyPayment)}`;
    
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Loan Calculation Result'),
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
      localStorage.removeItem('loan-calculator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setLoanAmount(entry.loanAmount);
    setInterestRate(entry.interestRate);
    setLoanTerm(entry.loanTerm);
    setResult(entry.result);
    setActiveTab('calculator');
  };

  const applyQuickPreset = (type: 'car' | 'mortgage' | 'personal') => {
    setQuickPreset(type);
    switch(type) {
      case 'car':
        setLoanAmount(25000);
        setInterestRate(6.5);
        setLoanTerm(5);
        break;
      case 'mortgage':
        setLoanAmount(300000);
        setInterestRate(4.5);
        setLoanTerm(30);
        break;
      case 'personal':
        setLoanAmount(15000);
        setInterestRate(8.5);
        setLoanTerm(3);
        break;
    }
    setTimeout(() => calculateLoan(), 0);
  };

  useEffect(() => {
    if (mounted) {
      calculateLoan();
    }
  }, [loanAmount, interestRate, loanTerm, mounted]);

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  // Chart data for pie chart
  const getChartData = () => {
    if (!result) return null;
    return {
      principal: loanAmount,
      interest: result.totalInterest
    };
  };

  const chartData = getChartData();

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
              <Calculator className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Loan Calculator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Calculate your monthly payments and total loan cost')}
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
            onClick={() => setActiveTab('amortization')}
            disabled={!result}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${!result ? 'opacity-50 cursor-not-allowed' : activeTab === 'amortization' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'amortization' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'amortization' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'amortization' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Calendar className="h-4 w-4" />
            {t('tab_amortization', 'Amortization')}
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
                {/* Quick Presets */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <p className="text-sm font-medium mb-3" style={{ color: themeColors.text.secondary }}>
                    {t('quick_presets', 'Quick Presets')}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => applyQuickPreset('car')}
                      className={`py-2 rounded-lg text-sm transition-all ${quickPreset === 'car' ? 'scale-105' : 'hover:scale-102'}`}
                      style={{ 
                        backgroundColor: quickPreset === 'car' ? themeColors.primary : themeColors.background,
                        color: quickPreset === 'car' ? themeColors.text.accent : themeColors.text.primary,
                        border: `1px solid ${quickPreset === 'car' ? 'transparent' : themeColors.border}`
                      }}
                    >
                      {t('car_loan', 'Car Loan')}
                    </button>
                    <button
                      onClick={() => applyQuickPreset('mortgage')}
                      className={`py-2 rounded-lg text-sm transition-all ${quickPreset === 'mortgage' ? 'scale-105' : 'hover:scale-102'}`}
                      style={{ 
                        backgroundColor: quickPreset === 'mortgage' ? themeColors.primary : themeColors.background,
                        color: quickPreset === 'mortgage' ? themeColors.text.accent : themeColors.text.primary,
                        border: `1px solid ${quickPreset === 'mortgage' ? 'transparent' : themeColors.border}`
                      }}
                    >
                      {t('mortgage', 'Mortgage')}
                    </button>
                    <button
                      onClick={() => applyQuickPreset('personal')}
                      className={`py-2 rounded-lg text-sm transition-all ${quickPreset === 'personal' ? 'scale-105' : 'hover:scale-102'}`}
                      style={{ 
                        backgroundColor: quickPreset === 'personal' ? themeColors.primary : themeColors.background,
                        color: quickPreset === 'personal' ? themeColors.text.accent : themeColors.text.primary,
                        border: `1px solid ${quickPreset === 'personal' ? 'transparent' : themeColors.border}`
                      }}
                    >
                      {t('personal_loan', 'Personal Loan')}
                    </button>
                  </div>
                </div>

                {/* Input Section */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Calculator className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('loan_details', 'Loan Details')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('loan_amount', 'Loan Amount')} ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                        <input
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('interest_rate', 'Annual Interest Rate')} (%)
                      </label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                        <input
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('loan_term', 'Loan Term')} ({t('years', 'Years')})
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                        <input
                          type="number"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          min="1"
                          max="30"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                {result && (
                  <>
                    <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                        {t('loan_summary', 'Loan Summary')}
                      </h2>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span style={{ color: themeColors.text.secondary }}>{t('monthly_payment', 'Monthly Payment')}:</span>
                          <span className="text-2xl font-bold" style={{ color: themeColors.success }}>
                            {formatCurrency(result.monthlyPayment)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: themeColors.text.secondary }}>{t('total_payment', 'Total Payment')}:</span>
                          <span className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                            {formatCurrency(result.totalPayment)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: themeColors.text.secondary }}>{t('total_interest', 'Total Interest')}:</span>
                          <span className="text-lg font-semibold" style={{ color: themeColors.error }}>
                            {formatCurrency(result.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: themeColors.text.secondary }}>{t('loan_term', 'Loan Term')}:</span>
                          <span className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                            {loanTerm} {t('years', 'years')} ({loanTerm * 12} {t('months', 'months')})
                          </span>
                        </div>
                      </div>

                      {/* Chart Toggle */}
                      <button
                        onClick={() => setShowChart(!showChart)}
                        className="w-full mt-4 py-2 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                        style={{ color: themeColors.primary }}
                      >
                        {showChart ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {showChart ? t('hide_chart', 'Hide Chart') : t('show_chart', 'Show Chart')}
                      </button>

                      {showChart && chartData && (
                        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                          <h3 className="text-sm font-semibold mb-3" style={{ color: themeColors.text.primary }}>
                            {t('payment_breakdown', 'Payment Breakdown')}
                          </h3>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-32 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PieChart className="h-16 w-16 opacity-50" style={{ color: themeColors.text.secondary }} />
                              </div>
                              <div 
                                className="absolute bottom-0 left-0 rounded-t-lg transition-all"
                                style={{ 
                                  width: `${(chartData.principal / (chartData.principal + chartData.interest)) * 100}%`,
                                  height: '80px',
                                  backgroundColor: themeColors.success,
                                  borderTopLeftRadius: '8px',
                                  borderTopRightRadius: chartData.interest === 0 ? '8px' : '0'
                                }}
                              />
                              <div 
                                className="absolute bottom-0 right-0 rounded-t-lg transition-all"
                                style={{ 
                                  width: `${(chartData.interest / (chartData.principal + chartData.interest)) * 100}%`,
                                  height: '80px',
                                  backgroundColor: themeColors.error,
                                  borderTopRightRadius: '8px'
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: themeColors.success }} />
                                <span className="text-xs">{t('principal', 'Principal')}: {formatCurrency(chartData.principal)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: themeColors.error }} />
                                <span className="text-xs">{t('interest', 'Interest')}: {formatCurrency(chartData.interest)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

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

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />
                  </>
                )}
              </div>
            )}

            {/* Amortization Tab */}
            {activeTab === 'amortization' && result && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                    {t('amortization_schedule', 'Amortization Schedule')}
                  </h2>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('showing_first', `Showing first 12 months of ${result.amortization.length} total`)}
                  </p>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0" style={{ backgroundColor: themeColors.surface }}>
                      <tr style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                        <th className="text-left p-3" style={{ color: themeColors.text.primary }}>{t('month', 'Month')}</th>
                        <th className="text-right p-3" style={{ color: themeColors.text.primary }}>{t('payment', 'Payment')}</th>
                        <th className="text-right p-3" style={{ color: themeColors.text.primary }}>{t('principal', 'Principal')}</th>
                        <th className="text-right p-3" style={{ color: themeColors.text.primary }}>{t('interest', 'Interest')}</th>
                        <th className="text-right p-3" style={{ color: themeColors.text.primary }}>{t('balance', 'Balance')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortization.slice(0, 12).map((row) => (
                        <tr key={row.month} style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                          <td className="p-3" style={{ color: themeColors.text.primary }}>{row.month}</td>
                          <td className="text-right p-3" style={{ color: themeColors.text.primary }}>{formatCurrency(row.payment)}</td>
                          <td className="text-right p-3" style={{ color: themeColors.text.primary }}>{formatCurrency(row.principal)}</td>
                          <td className="text-right p-3" style={{ color: themeColors.error }}>{formatCurrency(row.interest)}</td>
                          <td className="text-right p-3" style={{ color: themeColors.text.primary }}>{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.amortization.length > 12 && (
                  <div className="p-4 text-center border-t" style={{ borderColor: themeColors.border }}>
                    <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                      {t('remaining_months', `${result.amortization.length - 12} more months`)}
                    </p>
                  </div>
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
                        {t('recent_calculations', 'Your recent loan calculations')}
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
                              <Calculator className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {formatCurrency(entry.loanAmount)} @ {entry.interestRate}%
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                              {t('monthly_payment', 'Monthly')}: {formatCurrency(entry.result.monthlyPayment)} | 
                              {t('term', 'Term')}: {entry.loanTerm} {t('years', 'years')}
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
                      {t('history_will_appear', 'Your loan calculations will appear here')}
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

        {/* Loan Tips */}
        <div 
          className="mt-8 rounded-xl p-6"
          style={{ 
            backgroundColor: `${themeColors.primary}10`,
            border: `1px solid ${themeColors.primary}30`
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>{t('loan_tips', 'Loan Tips')}</h3>
          <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
            <li>{t('tip_1', 'Shorter loan terms generally have lower total interest costs')}</li>
            <li>{t('tip_2', 'Even a small reduction in interest rate can save thousands over the loan term')}</li>
            <li>{t('tip_3', 'Consider making extra payments to reduce principal and pay off loan faster')}</li>
            <li>{t('tip_4', 'Compare offers from multiple lenders to get the best rate')}</li>
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
