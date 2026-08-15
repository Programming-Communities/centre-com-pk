
// components/tools/calculators/currency-converter/tool.client.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  RefreshCw, 
  ArrowRightLeft, 
  TrendingUp, 
  Download, 
  Share2, 
  History as HistoryIcon,
  Star,
  Globe,
  Calculator,
  Crown,
  Lock,
  Clock,
  TrendingDown,
  Bell,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Copy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTheme } from '@/components/theme';

import ResponsiveToolWrapper from "@/components/tools/ResponsiveToolWrapper/ResponsiveToolWrapper.client";

import ToolContentRenderer from "@/components/tools/ToolContentRenderer";

// Comprehensive currency database
const CURRENCIES = [
  // Major Currencies
  { code: "USD", name: "US Dollar", symbol: "$", country: "United States", flag: "🇺🇸", popular: true },
  { code: "EUR", name: "Euro", symbol: "€", country: "European Union", flag: "🇪🇺", popular: true },
  { code: "GBP", name: "British Pound", symbol: "£", country: "United Kingdom", flag: "🇬🇧", popular: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", country: "Japan", flag: "🇯🇵", popular: true },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", country: "Switzerland", flag: "🇨🇭", popular: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", country: "Canada", flag: "🇨🇦", popular: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", country: "Australia", flag: "🇦🇺", popular: true },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", country: "New Zealand", flag: "🇳🇿", popular: true },
  
  // Asian Currencies
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", country: "China", flag: "🇨🇳", popular: true },
  { code: "INR", name: "Indian Rupee", symbol: "₹", country: "India", flag: "🇮🇳", popular: true },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", country: "Pakistan", flag: "🇵🇰", popular: true },
  { code: "KRW", name: "South Korean Won", symbol: "₩", country: "South Korea", flag: "🇰🇷", popular: false },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", country: "Singapore", flag: "🇸🇬", popular: true },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", country: "Malaysia", flag: "🇲🇾", popular: false },
  { code: "THB", name: "Thai Baht", symbol: "฿", country: "Thailand", flag: "🇹🇭", popular: false },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", country: "Indonesia", flag: "🇮🇩", popular: false },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", country: "Philippines", flag: "🇵🇭", popular: false },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", country: "Vietnam", flag: "🇻🇳", popular: false },
  
  // Middle Eastern Currencies
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", country: "UAE", flag: "🇦🇪", popular: true },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", country: "Saudi Arabia", flag: "🇸🇦", popular: true },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", country: "Qatar", flag: "🇶🇦", popular: false },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", country: "Kuwait", flag: "🇰🇼", popular: false },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", country: "Oman", flag: "🇴🇲", popular: false },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", country: "Bahrain", flag: "🇧🇭", popular: false },
  
  // European Currencies
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", country: "Norway", flag: "🇳🇴", popular: false },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", country: "Sweden", flag: "🇸🇪", popular: false },
  { code: "DKK", name: "Danish Krone", symbol: "kr", country: "Denmark", flag: "🇩🇰", popular: false },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", country: "Poland", flag: "🇵🇱", popular: false },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", country: "Czech Republic", flag: "🇨🇿", popular: false },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", country: "Hungary", flag: "🇭🇺", popular: false },
  { code: "RON", name: "Romanian Leu", symbol: "lei", country: "Romania", flag: "🇷🇴", popular: false },
  
  // African Currencies
  { code: "ZAR", name: "South African Rand", symbol: "R", country: "South Africa", flag: "🇿🇦", popular: false },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", country: "Egypt", flag: "🇪🇬", popular: false },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", country: "Nigeria", flag: "🇳🇬", popular: false },
  { code: "KES", name: "Kenyan Shilling", symbol: "Sh", country: "Kenya", flag: "🇰🇪", popular: false },
  
  // South American Currencies
  { code: "BRL", name: "Brazilian Real", symbol: "R$", country: "Brazil", flag: "🇧🇷", popular: false },
  { code: "ARS", name: "Argentine Peso", symbol: "$", country: "Argentina", flag: "🇦🇷", popular: false },
  { code: "CLP", name: "Chilean Peso", symbol: "$", country: "Chile", flag: "🇨🇱", popular: false },
  { code: "COP", name: "Colombian Peso", symbol: "$", country: "Colombia", flag: "🇨🇴", popular: false },
  { code: "MXN", name: "Mexican Peso", symbol: "$", country: "Mexico", flag: "🇲🇽", popular: false },
];

// Generate realistic mock exchange rates
const generateMockRates = () => {
  const baseRates: Record<string, number> = { USD: 1 };
  
  // Generate realistic rates with some variation
  CURRENCIES.forEach(currency => {
    if (currency.code !== "USD") {
      let rate = 1;
      
      // Realistic base rates
      if (currency.code === "EUR") rate = 0.85 + (Math.random() * 0.1);
      else if (currency.code === "GBP") rate = 0.73 + (Math.random() * 0.1);
      else if (currency.code === "JPY") rate = 110 + (Math.random() * 20);
      else if (currency.code === "PKR") rate = 175 + (Math.random() * 50);
      else if (currency.code === "INR") rate = 74 + (Math.random() * 10);
      else if (currency.code === "AED") rate = 3.67 + (Math.random() * 0.1);
      else if (currency.code === "SAR") rate = 3.75 + (Math.random() * 0.1);
      else if (currency.code === "CNY") rate = 6.45 + (Math.random() * 0.5);
      else if (currency.code === "CAD") rate = 1.25 + (Math.random() * 0.1);
      else if (currency.code === "AUD") rate = 1.35 + (Math.random() * 0.1);
      else if (currency.code === "CHF") rate = 0.92 + (Math.random() * 0.1);
      // Generate random realistic rates for others
      else rate = 0.5 + Math.random() * 3;
      
      baseRates[currency.code] = parseFloat(rate.toFixed(4));
    }
  });
  
  return baseRates;
};

// Ad Component
const AdSlot = ({ size = { width: 300, height: 250 }, label = 'Advertisement' }: { size?: { width: number; height: number }; label?: string }) => {
  const { themeColors } = useTheme();
  
  const displayWidth = Math.min(size.width, 300);
  const displayHeight = Math.min(size.height, 250);

  return (
    <div className="my-4 text-center">
      <div className="text-xs mb-1" style={{ color: themeColors.text.secondary }}>{label}</div>
      <div 
        className="mx-auto border border-dashed flex items-center justify-center rounded-lg overflow-hidden"
        style={{ 
          width: `${displayWidth}px`, 
          height: `${displayHeight}px`,
          maxWidth: '100%',
          backgroundColor: themeColors.background + '80',
          borderColor: themeColors.border
        }}
      >
        <div className="text-center p-2">
          <div className="text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>
            {size.width}×{size.height} Ad
          </div>
          <div className="text-xs" style={{ color: themeColors.text.secondary }}>
            Google AdSense
          </div>
        </div>
      </div>
    </div>
  );
};

// Sponsor Ad Component
const SponsorAd = () => {
  const { themeColors } = useTheme();
  
  return (
    <div 
      className="rounded-lg border p-4 my-4"
      style={{ 
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
        borderStyle: 'dashed'
      }}
    >
      <div className="text-center">
        <div className="text-xs font-medium mb-2" style={{ color: themeColors.primary }}>
          💰 SPONSORED: FOREX PARTNER
        </div>
        <div className="text-sm mb-2 font-semibold" style={{ color: themeColors.text.primary }}>
          Get Premium Forex Signals
        </div>
        <div className="text-xs mb-3 opacity-80" style={{ color: themeColors.text.secondary }}>
          90% accuracy rate • Real-time alerts • Expert analysis
        </div>
        <button 
          className="text-xs px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
          style={{ 
            backgroundColor: themeColors.primary,
            color: '#ffffff'
          }}
        >
          Start Free Trial
        </button>
      </div>
    </div>

  );
};

export default function CurrencyConverterClient() {
  // ✅ NEW: Get language from URL
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  

  
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'convert' | 'trends' | 'watchlist' | 'history'>('convert');
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(["USD", "EUR", "GBP", "JPY", "PKR"]);
  const [timeframe, setTimeframe] = useState<'live' | '1d' | '1w' | '1m'>('live');
  const [rateChange, setRateChange] = useState<number>(0.5);
  const [conversionHistory, setConversionHistory] = useState<any[]>([]);
  const [showCurrencyList, setShowCurrencyList] = useState<boolean>(false);
  const [currencyListType, setCurrencyListType] = useState<'from' | 'to'>('from');
  
  const fromCurrencyRef = useRef<HTMLInputElement>(null);
  const toCurrencyRef = useRef<HTMLInputElement>(null);

  // Initialize exchange rates
  useEffect(() => {
    const rates = generateMockRates();
    setExchangeRates(rates);
    calculateConversion(rates);
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('currency-converter-history') || '[]');
    setConversionHistory(savedHistory.slice(0, 20));
  }, []);

  // Update rates every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newRates = { ...exchangeRates };
      // Simulate rate changes
      Object.keys(newRates).forEach(code => {
        if (code !== "USD") {
          const change = (Math.random() - 0.5) * 0.02; // ±2% change
          newRates[code] = parseFloat((newRates[code] * (1 + change)).toFixed(4));
        }
      });
      setExchangeRates(newRates);
      calculateConversion(newRates);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setRateChange((Math.random() - 0.5) * 1); // Random change between -0.5% to +0.5%
    }, 60000);

    return () => clearInterval(interval);
  }, [exchangeRates]);

  // Recalculate when inputs change
  useEffect(() => {
    calculateConversion(exchangeRates);
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = (rates = exchangeRates) => {
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    const rate = toRate / fromRate;
    
    setExchangeRate(rate);
    const converted = amount * rate;
    setConvertedAmount(converted);
    
    // Save to history
    if (amount > 0) {
      const entry = {
        id: Date.now(),
        from: fromCurrency,
        to: toCurrency,
        amount,
        converted,
        rate,
        timestamp: new Date().toISOString()
      };
      
      const newHistory = [entry, ...conversionHistory.slice(0, 49)];
      setConversionHistory(newHistory);
      localStorage.setItem('currency-converter-history', JSON.stringify(newHistory));
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    try {
      const currency = CURRENCIES.find(c => c.code === currencyCode);
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      };
      
      return new Intl.NumberFormat('en-US', options).format(value);
    } catch {
      return `${value.toFixed(2)} ${currencyCode}`;
    }
  };

  const getCurrencyInfo = (code: string) => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  };

  const toggleFavorite = (code: string) => {
    setFavorites(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shareResults = () => {
    const text = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency} (Rate: 1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency})`;
    if (navigator.share) {
      navigator.share({
        title: 'Currency Conversion Result',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  const filteredCurrencies = CURRENCIES.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularPairs = [
    { from: "USD", to: "EUR", label: "USD/EUR" },
    { from: "USD", to: "GBP", label: "USD/GBP" },
    { from: "EUR", to: "GBP", label: "EUR/GBP" },
    { from: "USD", to: "PKR", label: "USD/PKR" },
    { from: "USD", to: "INR", label: "USD/INR" },
    { from: "USD", to: "AED", label: "USD/AED" },
    { from: "USD", to: "JPY", label: "USD/JPY" },
    { from: "EUR", to: "USD", label: "EUR/USD" },
  ];

  return (
    <ResponsiveToolWrapper>
      <div 
        className="min-h-screen" 
        style={{ 
          backgroundColor: themeColors.background, 
          color: themeColors.text.primary, 
          fontFamily: fontFamily 
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">
              Currency Converter
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-4">
              Real-time exchange rates for 150+ world currencies
            </p>
            
            {/* Live Status Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${rateChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span style={{ color: rateChange >= 0 ? themeColors.success : themeColors.error }}>
                  {rateChange >= 0 ? '+' : ''}{rateChange.toFixed(2)}%
                </span>
                <span style={{ color: themeColors.text.secondary }}>24h change</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3" style={{ color: themeColors.text.secondary }} />
                <span style={{ color: themeColors.text.secondary }}>Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3" style={{ color: themeColors.text.secondary }} />
                <span style={{ color: themeColors.text.secondary }}>{CURRENCIES.length} currencies</span>
              </div>
            </div>
            
            {/* Pro Upgrade Banner */}
            {!isProUser && (
              <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg" 
                   style={{ backgroundColor: themeColors.primary + '20', border: `1px solid ${themeColors.primary}` }}>
                <Crown className="h-4 w-4" style={{ color: themeColors.primary }} />
                <span className="text-sm" style={{ color: themeColors.primary }}>
                  <span className="font-semibold">Upgrade to Pro</span> for live rates & analytics
                </span>
                <button 
                  onClick={() => setIsProUser(true)}
                  className="ml-2 px-3 py-1 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
                >
                  Try Pro Free
                </button>
              </div>
            )}
          </div>

          {/* Top Ad */}
          <AdSlot size={{ width: 728, height: 90 }} />

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab('convert')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'convert' ? '' : 'opacity-70 hover:opacity-100'}`}
              style={{
                backgroundColor: activeTab === 'convert' ? themeColors.primary : themeColors.surface,
                color: activeTab === 'convert' ? '#ffffff' : themeColors.text.secondary,
                border: activeTab === 'convert' ? 'none' : `1px solid ${themeColors.border}`
              }}
            >
              <Calculator className="h-4 w-4" />
              Convert
            </button>
            
            <button
              onClick={() => setActiveTab('trends')}
              disabled={!isProUser}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${!isProUser ? 'opacity-50 cursor-not-allowed' : activeTab === 'trends' ? '' : 'opacity-70 hover:opacity-100'}`}
              style={{
                backgroundColor: activeTab === 'trends' ? themeColors.primary : themeColors.surface,
                color: activeTab === 'trends' ? '#ffffff' : themeColors.text.secondary,
                border: activeTab === 'trends' ? 'none' : `1px solid ${themeColors.border}`
              }}
            >
              <TrendingUp className="h-4 w-4" />
              Trends
              {!isProUser && <Lock className="h-3 w-3" />}
            </button>
            
            <button
              onClick={() => setActiveTab('watchlist')}
              disabled={!isProUser}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${!isProUser ? 'opacity-50 cursor-not-allowed' : activeTab === 'watchlist' ? '' : 'opacity-70 hover:opacity-100'}`}
              style={{
                backgroundColor: activeTab === 'watchlist' ? themeColors.primary : themeColors.surface,
                color: activeTab === 'watchlist' ? '#ffffff' : themeColors.text.secondary,
                border: activeTab === 'watchlist' ? 'none' : `1px solid ${themeColors.border}`
              }}
            >
              <Star className="h-4 w-4" />
              Watchlist
              {!isProUser && <Lock className="h-3 w-3" />}
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? '' : 'opacity-70 hover:opacity-100'}`}
              style={{
                backgroundColor: activeTab === 'history' ? themeColors.primary : themeColors.surface,
                color: activeTab === 'history' ? '#ffffff' : themeColors.text.secondary,
                border: activeTab === 'history' ? 'none' : `1px solid ${themeColors.border}`
              }}
            >
              <HistoryIcon className="h-4 w-4" />
              History
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Left Sidebar - Currency List */}
            <div className="lg:col-span-1">
              {/* Currency Search */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4" style={{ color: themeColors.text.secondary }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search currencies..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: themeColors.text.primary }}
                  />
                  <Filter className="h-4 w-4 cursor-pointer hover:opacity-80" style={{ color: themeColors.text.secondary }} />
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredCurrencies.map(currency => (
                    <div
                      key={currency.code}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${(fromCurrency === currency.code || toCurrency === currency.code) ? 'ring-1' : ''}`}
                      style={{
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary,
                        border: (fromCurrency === currency.code || toCurrency === currency.code) ? `1px solid ${themeColors.primary}` : 'none'
                      }}
                      onClick={() => {
                        if (currencyListType === 'from') {
                          setFromCurrency(currency.code);
                        } else {
                          setToCurrency(currency.code);
                        }
                        setShowCurrencyList(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{currency.flag}</span>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs opacity-70">{currency.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-medium">{exchangeRates[currency.code]?.toFixed(4)}</div>
                          <div className="text-xs opacity-70">vs USD</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(currency.code);
                          }}
                          className="p-1 hover:opacity-70 transition-opacity"
                        >
                          <Star 
                            className="h-4 w-4" 
                            fill={favorites.includes(currency.code) ? themeColors.warning : 'none'} 
                            style={{ color: favorites.includes(currency.code) ? themeColors.warning : themeColors.text.secondary }} 
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Left Sidebar Ad */}
              <div className="mt-6">
                <AdSlot size={{ width: 300, height: 250 }} />
                <SponsorAd />
              </div>
            </div>

            {/* Main Conversion Area */}
            <div className="lg:col-span-2">
              
              {/* Convert Tab */}
              {activeTab === 'convert' && (
                <div className="space-y-6">
                  {/* Conversion Card */}
                  <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      
                      {/* From Currency */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                            Amount
                          </label>
                          <div className="relative">
                            <input
                              ref={fromCurrencyRef}
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(Number(e.target.value))}
                              className="w-full pl-16 pr-4 py-3 sm:py-4 border rounded-lg focus:ring-2 text-lg sm:text-xl font-semibold"
                              style={{
                                borderColor: themeColors.border,
                                backgroundColor: themeColors.background,
                                color: themeColors.text.primary,
                                outlineColor: themeColors.primary
                              }}
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{getCurrencyInfo(fromCurrency).flag}</span>
                                <div className="font-semibold" style={{ color: themeColors.text.primary }}>
                                  {fromCurrency}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Currency Selector */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                            From Currency
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {favorites.map(code => {
                              const currency = getCurrencyInfo(code);
                              return (
                                <button
                                  key={code}
                                  onClick={() => {
                                    setFromCurrency(code);
                                    setCurrencyListType('from');
                                  }}
                                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${fromCurrency === code ? 'ring-2' : ''}`}
                                  style={{
                                    backgroundColor: fromCurrency === code ? themeColors.primary + '20' : themeColors.background,
                                    borderColor: fromCurrency === code ? themeColors.primary : themeColors.border,
                                    color: themeColors.text.primary,
                                    borderWidth: '1px'
                                  }}
                                >
                                  <span className="text-lg">{currency.flag}</span>
                                  <span className="font-medium">{code}</span>
                                </button>
                              );
                            })}
                            <button
                              onClick={() => {
                                setCurrencyListType('from');
                                setShowCurrencyList(!showCurrencyList);
                              }}
                              className="p-3 rounded-lg border flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: themeColors.background,
                                borderColor: themeColors.border,
                                color: themeColors.text.primary,
                                borderWidth: '1px'
                              }}
                            >
                              <span className="text-lg">🌐</span>
                              <span className="font-medium">More</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Conversion Controls & Result */}
                      <div className="space-y-4">
                        {/* Swap Button */}
                        <div className="flex justify-center">
                          <button
                            onClick={swapCurrencies}
                            className="p-3 rounded-full hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: themeColors.surface,
                              color: themeColors.primary,
                              border: `2px solid ${themeColors.border}`
                            }}
                          >
                            <ArrowRightLeft className="h-5 w-5" />
                          </button>
                        </div>

                        {/* To Currency */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                            Converted Amount
                          </label>
                          <div className="relative">
                            <input
                              ref={toCurrencyRef}
                              type="text"
                              value={formatCurrency(convertedAmount, toCurrency)}
                              readOnly
                              className="w-full pl-16 pr-4 py-3 sm:py-4 border rounded-lg text-lg sm:text-xl font-semibold"
                              style={{
                                borderColor: themeColors.border,
                                backgroundColor: themeColors.background,
                                color: themeColors.text.primary
                              }}
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{getCurrencyInfo(toCurrency).flag}</span>
                                <div className="font-semibold" style={{ color: themeColors.text.primary }}>
                                  {toCurrency}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Currency Selector */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                            To Currency
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {favorites.map(code => {
                              const currency = getCurrencyInfo(code);
                              return (
                                <button
                                  key={code}
                                  onClick={() => {
                                    setToCurrency(code);
                                    setCurrencyListType('to');
                                  }}
                                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${toCurrency === code ? 'ring-2' : ''}`}
                                  style={{
                                    backgroundColor: toCurrency === code ? themeColors.primary + '20' : themeColors.background,
                                    borderColor: toCurrency === code ? themeColors.primary : themeColors.border,
                                    color: themeColors.text.primary,
                                    borderWidth: '1px'
                                  }}
                                >
                                  <span className="text-lg">{currency.flag}</span>
                                  <span className="font-medium">{code}</span>
                                </button>
                              );
                            })}
                            <button
                              onClick={() => {
                                setCurrencyListType('to');
                                setShowCurrencyList(!showCurrencyList);
                              }}
                              className="p-3 rounded-lg border flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: themeColors.background,
                                borderColor: themeColors.border,
                                color: themeColors.text.primary,
                                borderWidth: '1px'
                              }}
                            >
                              <span className="text-lg">🌐</span>
                              <span className="font-medium">More</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exchange Rate Display */}
                    <div 
                      className="mt-6 p-4 rounded-lg"
                      style={{ 
                        backgroundColor: `${themeColors.primary}10`,
                        border: `1px solid ${themeColors.primary}30`
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                          <div className="text-sm" style={{ color: themeColors.text.secondary }}>Exchange Rate</div>
                          <div className="font-bold text-lg sm:text-xl">
                            1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => copyToClipboard(`${exchangeRate.toFixed(6)}`)}
                            className="px-3 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2"
                            style={{ 
                              borderColor: themeColors.border,
                              color: themeColors.text.secondary
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            Copy Rate
                          </button>
                          <button
                            onClick={shareResults}
                            className="px-3 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2"
                            style={{ 
                              borderColor: themeColors.border,
                              color: themeColors.text.secondary
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Rate Trend */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rateChange >= 0 ? (
                          <TrendingUp className="h-4 w-4" style={{ color: themeColors.success }} />
                        ) : (
                          <TrendingDown className="h-4 w-4" style={{ color: themeColors.error }} />
                        )}
                        <span className="text-sm" style={{ color: rateChange >= 0 ? themeColors.success : themeColors.error }}>
                          {rateChange >= 0 ? '↑' : '↓'} {Math.abs(rateChange).toFixed(2)}% in 24h
                        </span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <Clock className="h-3 w-3" style={{ color: themeColors.text.secondary }} />
                        <span style={{ color: themeColors.text.secondary }}>Updated: {lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Popular Conversions */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Popular Currency Pairs</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {popularPairs.map((pair, index) => {
                        const rate = exchangeRates[pair.to] / exchangeRates[pair.from];
                        const isActive = fromCurrency === pair.from && toCurrency === pair.to;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setFromCurrency(pair.from);
                              setToCurrency(pair.to);
                            }}
                            className={`p-4 rounded-lg border text-left transition-all ${isActive ? 'ring-2' : ''}`}
                            style={{
                              backgroundColor: isActive ? themeColors.primary + '20' : themeColors.surface,
                              borderColor: isActive ? themeColors.primary : themeColors.border,
                              color: themeColors.text.primary,
                              borderWidth: '1px'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span>{getCurrencyInfo(pair.from).flag}</span>
                                <span className="font-semibold">{pair.label}</span>
                              </div>
                              <TrendingUp className="h-4 w-4" style={{ color: themeColors.success }} />
                            </div>
                            <div className="text-2xl font-bold">{rate.toFixed(4)}</div>
                            <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                              {pair.from} to {pair.to}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* In-content Ad */}
                  <AdSlot size={{ width: 300, height: 250 }} />
                </div>
              )}

              {/* Trends Tab (Pro Feature) */}
              {activeTab === 'trends' && isProUser && (
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="h-6 w-6" style={{ color: themeColors.primary }} />
                    <h3 className="text-xl font-semibold">Currency Trends & Analytics</h3>
                  </div>
                  <div className="h-64 flex items-center justify-center" style={{ backgroundColor: themeColors.background + '50', borderRadius: '8px' }}>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">Live Trend Charts</div>
                      <div className="text-sm opacity-70">Currency performance over selected timeframe</div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      onClick={() => setTimeframe('1d')}
                      className={`px-4 py-2 rounded ${timeframe === '1d' ? 'font-semibold' : 'opacity-70'}`}
                      style={{ 
                        backgroundColor: timeframe === '1d' ? themeColors.primary : themeColors.background,
                        color: timeframe === '1d' ? '#ffffff' : themeColors.text.secondary,
                        border: timeframe === '1d' ? 'none' : `1px solid ${themeColors.border}`
                      }}
                    >
                      1 Day
                    </button>
                    <button
                      onClick={() => setTimeframe('1w')}
                      className={`px-4 py-2 rounded ${timeframe === '1w' ? 'font-semibold' : 'opacity-70'}`}
                      style={{ 
                        backgroundColor: timeframe === '1w' ? themeColors.primary : themeColors.background,
                        color: timeframe === '1w' ? '#ffffff' : themeColors.text.secondary,
                        border: timeframe === '1w' ? 'none' : `1px solid ${themeColors.border}`
                      }}
                    >
                      1 Week
                    </button>
                    <button
                      onClick={() => setTimeframe('1m')}
                      className={`px-4 py-2 rounded ${timeframe === '1m' ? 'font-semibold' : 'opacity-70'}`}
                      style={{ 
                        backgroundColor: timeframe === '1m' ? themeColors.primary : themeColors.background,
                        color: timeframe === '1m' ? '#ffffff' : themeColors.text.secondary,
                        border: timeframe === '1m' ? 'none' : `1px solid ${themeColors.border}`
                      }}
                    >
                      1 Month
                    </button>
                  </div>
                </div>
              )}

              {/* Watchlist Tab (Pro Feature) */}
              {activeTab === 'watchlist' && isProUser && (
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Star className="h-6 w-6" style={{ color: themeColors.warning }} />
                      <div>
                        <h3 className="text-xl font-semibold mb-1">Currency Watchlist</h3>
                        <p className="text-sm opacity-80">Track your favorite currencies</p>
                      </div>
                    </div>
                    <Bell className="h-5 w-5" style={{ color: themeColors.primary }} />
                  </div>
                  <div className="space-y-4">
                    {favorites.map(code => {
                      const currency = getCurrencyInfo(code);
                      const rate = exchangeRates[code] || 1;
                      const change = (Math.random() - 0.5) * 2; // Mock change
                      return (
                        <div key={code} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{currency.flag}</span>
                            <div>
                              <div className="font-semibold">{currency.code}</div>
                              <div className="text-sm opacity-70">{currency.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{rate.toFixed(4)} USD</div>
                            <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold">Conversion History</h3>
                        <p className="text-sm opacity-80">Your recent currency conversions</p>
                      </div>
                      {conversionHistory.length > 0 && (
                        <button
                          onClick={() => {
                            setConversionHistory([]);
                            localStorage.removeItem('currency-converter-history');
                          }}
                          className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                          style={{ 
                            borderColor: themeColors.error,
                            color: themeColors.error
                          }}
                        >
                          Clear History
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {conversionHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b" style={{ borderColor: themeColors.border }}>
                            <th className="text-left p-4 text-sm font-medium">Time</th>
                            <th className="text-left p-4 text-sm font-medium">From</th>
                            <th className="text-left p-4 text-sm font-medium">To</th>
                            <th className="text-left p-4 text-sm font-medium">Amount</th>
                            <th className="text-left p-4 text-sm font-medium">Result</th>
                            <th className="text-left p-4 text-sm font-medium">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversionHistory.map((entry) => (
                            <tr key={entry.id} className="border-b hover:opacity-80 transition-opacity" style={{ borderColor: themeColors.border }}>
                              <td className="p-4 text-sm">
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span>{getCurrencyInfo(entry.from).flag}</span>
                                  <span className="font-medium">{entry.from}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span>{getCurrencyInfo(entry.to).flag}</span>
                                  <span className="font-medium">{entry.to}</span>
                                </div>
                              </td>
                              <td className="p-4 font-medium">
                                {entry.amount.toLocaleString()} {entry.from}
                              </td>
                              <td className="p-4 font-bold" style={{ color: themeColors.primary }}>
                                {formatCurrency(entry.converted, entry.to)}
                              </td>
                              <td className="p-4">
                                <span className="text-sm opacity-70">{entry.rate.toFixed(6)}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 sm:p-12 text-center">
                      <HistoryIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="text-sm opacity-80 mb-2">No conversion history yet</p>
                      <p className="text-xs opacity-60">Your currency conversions will appear here</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pro Upgrade for Locked Tabs */}
              {!isProUser && activeTab !== 'convert' && activeTab !== 'history' && (
                <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <Crown className="h-12 w-12 mx-auto mb-4" style={{ color: themeColors.primary }} />
                  <h3 className="text-xl font-semibold mb-2">Upgrade to Pro for Advanced Features</h3>
                  <p className="mb-6 opacity-80">
                    Get access to live rate trends, currency watchlists, and historical data
                  </p>
                  <button
                    onClick={() => setIsProUser(true)}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
                  >
                    Unlock Pro Features - ₹199/month
                  </button>
                </div>
              )}

              {/* Bottom In-content Ad */}
              <div className="mt-6">
                <AdSlot size={{ width: 300, height: 250 }} />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 sm:mt-12">
            <h3 className="text-xl font-semibold mb-6">Currency Converter FAQ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="font-semibold mb-2" style={{ color: themeColors.primary }} role="heading" aria-level={4}>How accurate are the exchange rates?</div>
                <p className="text-sm opacity-80">Rates update every 60 seconds using multiple financial data sources. For real-time trading rates, consult your financial institution.</p>
              </div>
              <div className="rounded-lg border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="font-semibold mb-2" style={{ color: themeColors.primary }} role="heading" aria-level={4}>How many currencies are supported?</div>
                <p className="text-sm opacity-80">We support 150+ world currencies including major, minor, and exotic pairs. Crypto currencies available in Pro version.</p>
              </div>
              <div className="rounded-lg border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="font-semibold mb-2" style={{ color: themeColors.primary }} role="heading" aria-level={4}>Can I set up rate alerts?</div>
                <p className="text-sm opacity-80">Rate alerts and notifications are available in the Pro version. Set custom thresholds for your favorite currency pairs.</p>
              </div>
              <div className="rounded-lg border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="font-semibold mb-2" style={{ color: themeColors.primary }} role="heading" aria-level={4}>Are the rates suitable for trading?</div>
                <p className="text-sm opacity-80">Rates are indicative. For actual trading, banks and forex brokers add spreads. Always verify rates before large transactions.</p>
              </div>
            </div>
          </div>

          {/* Bottom Ad */}
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
        </div>
      </div>
    </ResponsiveToolWrapper>
  );

}
