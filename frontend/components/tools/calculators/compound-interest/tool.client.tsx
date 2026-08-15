
"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { TrendingUp, DollarSign, Calendar, Percent, Repeat } from "lucide-react";
import ResponsiveToolWrapper from "@/components/tools/ResponsiveToolWrapper/ResponsiveToolWrapper.client";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


interface CompoundResult {
  futureValue: number;
  totalInterest: number;
  totalDeposits: number;
  yearlyBreakdown: Array<{
    year: number;
    balance: number;
    interest: number;

  }>;
}

export default function CompoundInterestClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tCommon } = useTranslation({ namespace: 'common' });
  const { t: tTools } = useTranslation({ namespace: 'tools', category: 'calculators' });
  
  const [mounted, setMounted] = useState(false);
  const [principal, setPrincipal] = useState<number>(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100);
  const [annualRate, setAnnualRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [compoundFrequency, setCompoundFrequency] = useState<'annually' | 'semi-annually' | 'quarterly' | 'monthly'>('monthly');
  const [result, setResult] = useState<CompoundResult | null>(null);
  
  // Helper function to get compound interest translations
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `compound-interest.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateCompoundInterest = () => {
    const periodsPerYear = {
      'annually': 1,
      'semi-annually': 2,
      'quarterly': 4,
      'monthly': 12,
    }[compoundFrequency];

    const ratePerPeriod = annualRate / 100 / periodsPerYear;
    const totalPeriods = years * periodsPerYear;
    
    let futureValue = principal;
    let totalDeposits = principal;
    const yearlyBreakdown = [];
    
    for (let year = 1; year <= years; year++) {
      let yearInterest = 0;
      
      for (let period = 0; period < periodsPerYear; period++) {
        if (!(year === 1 && period === 0)) {
          futureValue += monthlyDeposit * (periodsPerYear / 12);
          totalDeposits += monthlyDeposit * (periodsPerYear / 12);
        }
        
        const periodInterest = futureValue * ratePerPeriod;
        futureValue += periodInterest;
        yearInterest += periodInterest;
      }
      
      yearlyBreakdown.push({
        year,
        balance: Number(futureValue.toFixed(2)),
        interest: Number(yearInterest.toFixed(2))
      });
    }

    const totalInterest = futureValue - totalDeposits;

    setResult({
      futureValue: Number(futureValue.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalDeposits: Number(totalDeposits.toFixed(2)),
      yearlyBreakdown
    });
  };

  useEffect(() => {
    if (mounted) {
      calculateCompoundInterest();
    }
  }, [principal, monthlyDeposit, annualRate, years, compoundFrequency, mounted]);

  const formatCurrency = (amount: number) => {
    const locale = lang === 'ur' || lang === 'ar' ? 'en-US' : 
                   lang === 'hi' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: lang === 'hi' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const frequencies = [
    { value: 'annually', label: t('annually', 'Annually') },
    { value: 'semi-annually', label: t('semi_annually', 'Semi-Annually') },
    { value: 'quarterly', label: t('quarterly', 'Quarterly') },
    { value: 'monthly', label: t('monthly', 'Monthly') },
  ];

  const scenarios = [
    { principal: 1000, monthly: 100, rate: 5, years: 10, label: t('moderate_growth', 'Moderate Growth') },
    { principal: 5000, monthly: 200, rate: 7, years: 20, label: t('long_term_investment', 'Long-term Investment') },
    { principal: 10000, monthly: 500, rate: 8, years: 30, label: t('aggressive_savings', 'Aggressive Savings') },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">{tCommon('loading', 'Loading...')}</div>
      </div>
    );
  }

  const isRTL = lang === 'ur' || lang === 'ar';

  return (
    <ResponsiveToolWrapper>

      <div className={`max-w-4xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <TrendingUp className="w-6 h-6" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            {t('title', 'Compound Interest Calculator')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('subtitle', 'See how your money grows with compound interest over time')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: themeColors.surface }}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                <TrendingUp className="h-5 w-5" style={{ color: themeColors.primary }} />
                {t('investment_details', 'Investment Details')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {t('initial_investment', 'Initial Investment')}
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4`} style={{ color: themeColors.text.secondary }} />
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-text-primary`}
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary
                      }}
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {t('monthly_contribution', 'Monthly Contribution')}
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4`} style={{ color: themeColors.text.secondary }} />
                    <input
                      type="number"
                      value={monthlyDeposit}
                      onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                      className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-text-primary`}
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary
                      }}
                      min="0"
                      step="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {t('annual_interest_rate', 'Annual Interest Rate (%)')}
                  </label>
                  <div className="relative">
                    <Percent className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4`} style={{ color: themeColors.text.secondary }} />
                    <input
                      type="number"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-text-primary`}
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {t('time_period', 'Time Period (Years)')}
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4`} style={{ color: themeColors.text.secondary }} />
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-text-primary`}
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary
                      }}
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {t('compound_frequency', 'Compound Frequency')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {frequencies.map(freq => (
                      <button
                        key={freq.value}
                        onClick={() => setCompoundFrequency(freq.value as any)}
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          compoundFrequency === freq.value
                            ? 'text-white'
                            : 'text-text-secondary hover:border-border'
                        }`}
                        style={{ 
                          borderColor: compoundFrequency === freq.value ? themeColors.primary : themeColors.border,
                          backgroundColor: compoundFrequency === freq.value ? themeColors.primary : themeColors.background
                        }}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: themeColors.surface }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('investment_summary', 'Investment Summary')}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span style={{ color: themeColors.text.secondary }}>{t('future_value', 'Future Value')}:</span>
                      <span className="text-2xl font-bold" style={{ color: themeColors.success }}>
                        {formatCurrency(result.futureValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: themeColors.text.secondary }}>{t('total_deposits', 'Total Deposits')}:</span>
                      <span className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                        {formatCurrency(result.totalDeposits)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: themeColors.text.secondary }}>{t('total_interest_earned', 'Total Interest Earned')}:</span>
                      <span className="text-lg font-semibold" style={{ color: themeColors.primary }}>
                        {formatCurrency(result.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: themeColors.text.secondary }}>{t('time_period', 'Time Period')}:</span>
                      <span className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                        {years} {t('years', 'years')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Yearly Breakdown */}
                <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: themeColors.surface }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('yearly_growth', 'Yearly Growth')}
                  </h2>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                          <th className={`${isRTL ? 'text-right' : 'text-left'} py-2`} style={{ color: themeColors.text.primary }}>{t('year', 'Year')}</th>
                          <th className="text-right py-2" style={{ color: themeColors.text.primary }}>{t('balance', 'Balance')}</th>
                          <th className="text-right py-2" style={{ color: themeColors.text.primary }}>{t('interest', 'Interest')}</th>
                         </tr>
                      </thead>
                      <tbody>
                        {result.yearlyBreakdown.slice(0, 10).map((row) => (
                          <tr key={row.year} style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                            <td className={`${isRTL ? 'text-right' : 'text-left'} py-2`} style={{ color: themeColors.text.primary }}>{row.year}</td>
                            <td className="text-right py-2" style={{ color: themeColors.text.primary }}>{formatCurrency(row.balance)}</td>
                            <td className="text-right py-2" style={{ color: themeColors.primary }}>{formatCurrency(row.interest)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.yearlyBreakdown.length > 10 && (
                      <p className="text-center text-sm mt-2" style={{ color: themeColors.text.secondary }}>
                        {t('showing_first', `Showing first 10 years of ${result.yearlyBreakdown.length} total`)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Formula Card */}
                <div 
                  className="rounded-xl p-4"
                  style={{ 
                    backgroundColor: `${themeColors.primary}10`,
                    border: `1px solid ${themeColors.primary}30`
                  }}
                >
                  <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: themeColors.primary }}>
                    <Repeat className="h-4 w-4" />
                    {t('compound_interest_formula', 'Compound Interest Formula')}
                  </h3>
                  <p className="text-sm mb-2 font-mono" style={{ color: themeColors.primary }}>
                    {t('formula', 'A = P(1 + r/n)^(nt)')}
                  </p>
                  <ul className="text-xs space-y-1" style={{ color: themeColors.primary }}>
                    <li>A = {t('future_value', 'Future value')}</li>
                    <li>P = {t('initial_investment', 'Principal amount')}</li>
                    <li>r = {t('annual_interest_rate', 'Annual interest rate')}</li>
                    <li>n = {t('compound_frequency', 'Compounding frequency')}</li>
                    <li>t = {t('time_period', 'Time in years')}</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Scenarios */}
        <div className="mt-8 rounded-xl border border-border p-6" style={{ backgroundColor: themeColors.surface }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
            {t('quick_scenarios', 'Quick Scenarios')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrincipal(scenario.principal);
                  setMonthlyDeposit(scenario.monthly);
                  setAnnualRate(scenario.rate);
                  setYears(scenario.years);
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
                <div className="font-semibold">{scenario.label}</div>
                <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                  {formatCurrency(scenario.principal)} + {formatCurrency(scenario.monthly)}/month
                </div>
                <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                  {scenario.rate}% for {scenario.years} {t('years', 'years')}
                </div>
              </button>
            ))}
          </div>
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
        </div>
      </div>
    </ResponsiveToolWrapper>
  );

}
