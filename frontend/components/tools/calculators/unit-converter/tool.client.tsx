
// components/tools/calculators/unit-converter/tool.client.tsx
"use client";

import { useState, useEffect } from "react";
import { Ruler, Scale, Thermometer, Droplets, Navigation, History, Copy, Download, Share2, CheckCircle, RefreshCw, Calculator, ArrowRightLeft, Star, Search } from "lucide-react";
import { useTheme } from '@/components/theme';

import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

import ToolContentRenderer from "@/components/tools/ToolContentRenderer";

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area';

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

interface HistoryEntry {
  id: number;
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  timestamp: string;
}

const unitConversions: Record<UnitCategory, Unit[]> = {
  length: [
    { name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0255 },
    { name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
  ],
  weight: [
    { name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: 'Grams', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Metric Tons', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { name: 'Pounds', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: 'Stones', symbol: 'st', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ],
  temperature: [
    { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
    { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { name: 'Milliliters', symbol: 'ml', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Cubic Meters', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Teaspoons', symbol: 'tsp', toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 },
    { name: 'Tablespoons', symbol: 'tbsp', toBase: (v) => v * 0.0147868, fromBase: (v) => v / 0.0147868 },
    { name: 'Cups', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { name: 'Pints', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { name: 'Gallons', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  ],
  area: [
    { name: 'Square Millimeters', symbol: 'mm²', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: 'Square Centimeters', symbol: 'cm²', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { name: 'Square Kilometers', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { name: 'Square Inches', symbol: 'in²', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    { name: 'Square Feet', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { name: 'Square Miles', symbol: 'mi²', toBase: (v) => v * 2589988, fromBase: (v) => v / 2589988 },
  ],
};

const categoryIcons = {
  length: Ruler,
  weight: Scale,
  temperature: Thermometer,
  volume: Droplets,
  area: Navigation,
};

const categoryNames = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
  volume: 'Volume',

  area: 'Area',
};

export default function UnitConverterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const [mounted, setMounted] = useState(false);
  
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'converter' | 'history'>('converter');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(['m', 'ft', 'kg', 'lb', '°C', '°F']);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `unit_converter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('unit-converter-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const convertUnits = () => {
    const fromUnitObj = unitConversions[category].find(u => u.symbol === fromUnit);
    const toUnitObj = unitConversions[category].find(u => u.symbol === toUnit);
    
    if (fromUnitObj && toUnitObj) {
      const baseValue = fromUnitObj.toBase(fromValue);
      const convertedValue = toUnitObj.fromBase(baseValue);
      const newToValue = Number(convertedValue.toFixed(6));
      setToValue(newToValue);
      
      // Save to history
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        category,
        fromUnit,
        toUnit,
        fromValue,
        toValue: newToValue,
        timestamp: new Date().toISOString()
      };
      
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('unit-converter-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  };

  useEffect(() => {
    if (mounted) {
      convertUnits();
    }
  }, [category, fromUnit, toUnit, fromValue, mounted]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const formatNumber = (value: number) => {
    if (value === 0) return '0';
    if (Math.abs(value) < 0.000001) return value.toExponential(6);
    if (Math.abs(value) > 999999) return value.toExponential(6);
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const copyResult = () => {
    const text = `${fromValue} ${fromUnit} = ${toValue} ${toUnit}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== UNIT CONVERSION REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n\n` +
                 `${t('conversion', 'Conversion')}:\n` +
                 `${fromValue} ${fromUnit} = ${toValue} ${toUnit}\n\n` +
                 `${t('category', 'Category')}: ${t(category, categoryNames[category])}\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk Unit Converter ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unit-conversion-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResult = () => {
    const shareText = `${fromValue} ${fromUnit} = ${toValue} ${toUnit}`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Unit Conversion Result'),
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
      localStorage.removeItem('unit-converter-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setCategory(entry.category);
    setFromUnit(entry.fromUnit);
    setToUnit(entry.toUnit);
    setFromValue(entry.fromValue);
    setActiveTab('converter');
  };

  const toggleFavorite = (unitSymbol: string) => {
    setFavorites(prev => 
      prev.includes(unitSymbol) 
        ? prev.filter(u => u !== unitSymbol)
        : [...prev, unitSymbol]
    );
  };

  const filteredUnits = unitConversions[category].filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[category];

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
            {t('title', 'Unit Converter')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Convert between different measurement systems and units')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'converter' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'converter' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'converter' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'converter' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Calculator className="h-4 w-4" />
            {t('tab_converter', 'Converter')}
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
            
            {/* Converter Tab */}
            {activeTab === 'converter' && (
              <div className="space-y-6">
                {/* Category Selection */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <CategoryIcon className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('select_category', 'Select Category')}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {(Object.keys(unitConversions) as UnitCategory[]).map((cat) => {
                      const Icon = categoryIcons[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setFromUnit(unitConversions[cat][0].symbol);
                            setToUnit(unitConversions[cat][1]?.symbol || unitConversions[cat][0].symbol);
                          }}
                          className={`p-3 rounded-lg border-2 transition-all ${category === cat ? 'scale-105' : 'hover:scale-102'}`}
                          style={{ 
                            borderColor: category === cat ? themeColors.primary : themeColors.border,
                            backgroundColor: category === cat ? `${themeColors.primary}10` : themeColors.background
                          }}
                        >
                          <Icon className="h-5 w-5 mx-auto mb-1" style={{ color: category === cat ? themeColors.primary : themeColors.text.secondary }} />
                          <span className="text-xs font-medium block text-center">{t(cat, categoryNames[cat])}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Unit Search */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" style={{ color: themeColors.text.secondary }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search_units', 'Search units...')}
                      className="flex-1 bg-transparent outline-none text-sm"
                      style={{ color: themeColors.text.primary }}
                    />
                  </div>
                </div>

                {/* Conversion Inputs */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="space-y-4">
                    {/* From Value */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('from', 'From')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={fromValue}
                          onChange={(e) => setFromValue(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg font-semibold"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          step="any"
                        />
                        <select
                          value={fromUnit}
                          onChange={(e) => setFromUnit(e.target.value)}
                          className="w-32 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                        >
                          {filteredUnits.map(unit => (
                            <option key={unit.symbol} value={unit.symbol}>
                              {unit.symbol}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={swapUnits}
                        className="p-2 rounded-full hover:opacity-80 transition-opacity"
                        style={{ 
                          backgroundColor: themeColors.background,
                          border: `1px solid ${themeColors.border}`
                        }}
                      >
                        <ArrowRightLeft className="h-5 w-5" style={{ color: themeColors.primary }} />
                      </button>
                    </div>

                    {/* To Value */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('to', 'To')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formatNumber(toValue)}
                          readOnly
                          className="flex-1 px-4 py-3 border rounded-lg text-lg font-semibold"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.primary
                          }}
                        />
                        <select
                          value={toUnit}
                          onChange={(e) => setToUnit(e.target.value)}
                          className="w-32 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                        >
                          {filteredUnits.map(unit => (
                            <option key={unit.symbol} value={unit.symbol}>
                              {unit.symbol}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
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
                </div>

                {/* Quick Conversions */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-3" style={{ color: themeColors.text.primary }}>
                    {t('quick_conversions', 'Quick Conversions')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { from: 'm', to: 'ft', label: t('meters_to_feet', 'Meters to Feet') },
                      { from: 'km', to: 'mi', label: t('km_to_miles', 'Km to Miles') },
                      { from: 'kg', to: 'lb', label: t('kg_to_pounds', 'Kg to Pounds') },
                      { from: '°C', to: '°F', label: t('celsius_to_fahrenheit', 'Celsius to Fahrenheit') },
                    ]
                    .filter(conv => unitConversions[category].some(u => u.symbol === conv.from))
                    .map((conv, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFromUnit(conv.from);
                          setToUnit(conv.to);
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
                        {conv.label}
                      </button>
                    ))}
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
                        {t('conversion_history', 'Conversion History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_conversions', 'Your recent unit conversions')}
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
                      const Icon = categoryIcons[entry.category];
                      return (
                        <div key={entry.id} className="p-4 hover:opacity-80 transition-opacity">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-4 w-4" style={{ color: themeColors.primary }} />
                                <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                  {t(entry.category, categoryNames[entry.category])}
                                </span>
                              </div>
                              <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                                {entry.fromValue} {entry.fromUnit} = {entry.toValue} {entry.toUnit}
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
                      {t('no_history', 'No conversion history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your unit conversions will appear here')}
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

        {/* Common Conversion Factors */}
        <div 
          className="mt-8 rounded-xl p-6"
          style={{ 
            backgroundColor: `${themeColors.primary}10`,
            border: `1px solid ${themeColors.primary}30`
          }}
        >
          <h3 className="font-semibold mb-3" style={{ color: themeColors.primary }}>
            {t('common_conversion_factors', 'Common Conversion Factors')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.primary }}>{t('length', 'Length')}</h4>
              <ul className="space-y-1" style={{ color: themeColors.primary }}>
                <li>1 inch = 2.55 cm</li>
                <li>1 foot = 0.3048 m</li>
                <li>1 mile = 1.609 km</li>
                <li>1 meter = 3.281 feet</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.primary }}>{t('weight', 'Weight')}</h4>
              <ul className="space-y-1" style={{ color: themeColors.primary }}>
                <li>1 ounce = 28.35 g</li>
                <li>1 pound = 0.455 kg</li>
                <li>1 kg = 2.205 pounds</li>
                <li>1 stone = 6.35 kg</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: themeColors.primary }}>{t('temperature', 'Temperature')}</h4>
              <ul className="space-y-1" style={{ color: themeColors.primary }}>
                <li>°F = (°C × 9/5) + 32</li>
                <li>°C = (°F - 32) × 5/9</li>
                <li>K = °C + 273.15</li>
                <li>Water boils at 100°C / 212°F</li>
              </ul>
            </div>
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
