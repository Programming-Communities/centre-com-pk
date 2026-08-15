
'use client';

import { useState, useEffect } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  Download, 
  Share2, 
  TrendingUp,
  Heart,
  Activity,
  Target,
  History as HistoryIcon,
  Crown,
  Lock,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
import { useTheme } from '@/components/theme';
import './bmi-calculator.css';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import WHOStandards from './WHOStandards';
import HealthRiskAssessment from './HealthRiskAssessment';
import CountryBMIComparison from './CountryBMIComparison';

// Define BMI categories with translation keys
const BMICategories = [
  { categoryKey: 'severely_underweight', range: '<16', color: '#3B82F6', descriptionKey: 'significant_health_risk', riskKey: 'high', adviceKey: 'consult_healthcare' },
  { categoryKey: 'underweight', range: '16-18.4', color: '#60A5FA', descriptionKey: 'below_healthy_weight', riskKey: 'moderate', adviceKey: 'consider_weight_gain' },
  { categoryKey: 'normal', range: '18.5-24.9', color: '#10B981', descriptionKey: 'healthy_weight', riskKey: 'low', adviceKey: 'maintain_lifestyle' },
  { categoryKey: 'overweight', range: '25-29.9', color: '#F59E0B', descriptionKey: 'above_healthy_weight', riskKey: 'moderate', adviceKey: 'consider_weight_loss' },
  { categoryKey: 'obese_class_i', range: '30-34.9', color: '#F97316', descriptionKey: 'moderate_obesity', riskKey: 'high', adviceKey: 'recommended_weight_loss' },
  { categoryKey: 'obese_class_ii', range: '35-39.9', color: '#EF4444', descriptionKey: 'severe_obesity', riskKey: 'very_high', adviceKey: 'medical_advice_recommended' },
  { categoryKey: 'obese_class_iii', range: '≥40', color: '#DC2626', descriptionKey: 'morbid_obesity', riskKey: 'extreme', adviceKey: 'urgent_medical_attention' },
];

// Simple localStorage functions
const saveToHistory = (entry: any) => {
  if (typeof window === 'undefined') return;
  const history = JSON.parse(localStorage.getItem('bmi-calculator-history') || '[]');
  history.unshift(entry);
  if (history.length > 50) history.pop();
  localStorage.setItem('bmi-calculator-history', JSON.stringify(history));
};

const getHistory = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('bmi-calculator-history') || '[]');
};

const clearHistory = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('bmi-calculator-history');
};

export default function BMICalculatorTool() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  // Select content based on language


  const { t } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const { themeColors, fontFamily } = useTheme();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [isProUser, setIsProUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'charts' | 'recommendations' | 'history'>('calculator');
  
  // Advanced metrics (PRO features)
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [idealWeight, setIdealWeight] = useState<{ min: number; max: number } | null>(null);
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);
  const [waterIntake, setWaterIntake] = useState<number | null>(null);
  const [metabolicAge, setMetabolicAge] = useState<number | null>(null);

  // Get translated category names using t() function
  const getTranslatedCategory = (categoryKey: string): string => {
    const categoryMap: Record<string, string> = {
      'severely_underweight': t('severely_underweight', 'Severely Underweight'),
      'underweight': t('underweight', 'Underweight'),
      'normal': t('normal', 'Normal'),
      'overweight': t('overweight', 'Overweight'),
      'obese_class_i': t('obese_class_i', 'Obese Class I'),
      'obese_class_ii': t('obese_class_ii', 'Obese Class II'),
      'obese_class_iii': t('obese_class_iii', 'Obese Class III')
    };
    return categoryMap[categoryKey] || categoryKey;
  };

  // Get translated description using t() function
  const getTranslatedDescription = (descriptionKey: string): string => {
    const descMap: Record<string, string> = {
      'significant_health_risk': t('significant_health_risk', 'Significant health risk'),
      'below_healthy_weight': t('below_healthy_weight', 'Below healthy weight'),
      'healthy_weight': t('healthy_weight', 'Healthy weight'),
      'above_healthy_weight': t('above_healthy_weight', 'Above healthy weight'),
      'moderate_obesity': t('moderate_obesity', 'Moderate obesity'),
      'severe_obesity': t('severe_obesity', 'Severe obesity'),
      'morbid_obesity': t('morbid_obesity', 'Morbid obesity')
    };
    return descMap[descriptionKey] || descriptionKey;
  };

  // Get translated risk using t() function
  const getTranslatedRisk = (riskKey: string): string => {
    const riskMap: Record<string, string> = {
      'high': t('risk_high', 'High'),
      'moderate': t('risk_moderate', 'Moderate'),
      'low': t('risk_low', 'Low'),
      'very_high': t('risk_very_high', 'Very High'),
      'extreme': t('risk_extreme', 'Extreme')
    };
    return riskMap[riskKey] || riskKey;
  };

  // Get translated advice using t() function
  const getTranslatedAdvice = (adviceKey: string): string => {
    const adviceMap: Record<string, string> = {
      'consult_healthcare': t('advice_consult_healthcare', 'Consult healthcare provider'),
      'consider_weight_gain': t('advice_consider_weight_gain', 'Consider weight gain'),
      'maintain_lifestyle': t('advice_maintain_lifestyle', 'Maintain current lifestyle'),
      'consider_weight_loss': t('advice_consider_weight_loss', 'Consider weight loss'),
      'recommended_weight_loss': t('advice_recommended_weight_loss', 'Recommended weight loss'),
      'medical_advice_recommended': t('advice_medical_advice_recommended', 'Medical advice recommended'),
      'urgent_medical_attention': t('advice_urgent_medical_attention', 'Urgent medical attention')
    };
    return adviceMap[adviceKey] || adviceKey;
  };

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory().slice(0, 10));
  }, []);

  // Calculate advanced metrics when BMI changes
  useEffect(() => {
    if (bmi && height && weight && age && isProUser) {
      calculateAdvancedMetrics();
    }
  }, [bmi, height, weight, age, gender, isProUser]);

  const calculateBMI = () => {
    if (!height || !weight) {
      alert(t('enter_both_values', 'Please enter both height and weight'));
      return;
    }

    let heightInMeters, weightInKg;

    if (unit === 'metric') {
      heightInMeters = parseFloat(height) / 100; // cm to meters
      weightInKg = parseFloat(weight);
    } else {
      // Convert feet and inches to inches
      const feet = parseFloat(height.split('-')[0] || '0');
      const inches = parseFloat(height.split('-')[1] || '0');
      const totalInches = (feet * 12) + inches;
      heightInMeters = totalInches * 0.0254;
      weightInKg = parseFloat(weight) * 0.453592; // pounds to kg
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = parseFloat(bmiValue.toFixed(1));
    setBmi(roundedBMI);

    // Determine category
    let currentCategoryKey = '';
    let details = null;
    
    if (bmiValue < 16) {
      currentCategoryKey = 'severely_underweight';
      details = BMICategories[0];
    } else if (bmiValue < 18.5) {
      currentCategoryKey = 'underweight';
      details = BMICategories[1];
    } else if (bmiValue < 25) {
      currentCategoryKey = 'normal';
      details = BMICategories[2];
    } else if (bmiValue < 30) {
      currentCategoryKey = 'overweight';
      details = BMICategories[3];
    } else if (bmiValue < 35) {
      currentCategoryKey = 'obese_class_i';
      details = BMICategories[4];
    } else if (bmiValue < 40) {
      currentCategoryKey = 'obese_class_ii';
      details = BMICategories[5];
    } else {
      currentCategoryKey = 'obese_class_iii';
      details = BMICategories[6];
    }

    setCategory(currentCategoryKey);
    setCategoryDetails(details);

    // Save to history
    const historyEntry = {
      id: Date.now().toString(),
      toolName: 'BMI Calculator',
      inputData: { height, weight, unit, age, gender },
      resultData: { bmi: roundedBMI, category: currentCategoryKey },
      timestamp: new Date().toISOString(),
    };

    saveToHistory(historyEntry);
    
    // Update history display
    setHistory(getHistory().slice(0, 10));
  };

  const calculateAdvancedMetrics = () => {
    if (!bmi || !height || !weight || !age) return;

    const heightInMeters = unit === 'metric' ? parseFloat(height) / 100 : parseFloat(height) * 0.0254;
    const weightInKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    const ageNum = parseInt(age);

    // Body Fat Percentage estimation (using BMI method)
    const bodyFatValue = (1.20 * bmi) + (0.23 * ageNum) - (10.8 * (gender === 'male' ? 1 : 0)) - 5.4;
    setBodyFat(parseFloat(bodyFatValue.toFixed(1)));

    // Ideal Weight Range (based on height)
    const idealMin = 18.5 * (heightInMeters * heightInMeters);
    const idealMax = 24.9 * (heightInMeters * heightInMeters);
    setIdealWeight({
      min: parseFloat(idealMin.toFixed(1)),
      max: parseFloat(idealMax.toFixed(1))
    });

    // Daily Calorie Needs (Harris-Benedict equation)
    const bmr = gender === 'male' 
      ? 88.362 + (13.397 * weightInKg) + (4.799 * heightInMeters * 100) - (5.677 * ageNum)
      : 447.593 + (9.247 * weightInKg) + (3.098 * heightInMeters * 100) - (4.330 * ageNum);
    
    const maintenanceCalories = bmr * 1.55; // Moderate activity level
    setDailyCalories(Math.round(maintenanceCalories));

    // Water Intake (based on weight)
    const waterInLiters = weightInKg * 0.033;
    setWaterIntake(parseFloat(waterInLiters.toFixed(1)));

    // Metabolic Age (simplified)
    const metabolicAgeValue = ageNum - (bmi - 22) * 2;
    setMetabolicAge(Math.max(18, Math.min(80, Math.round(metabolicAgeValue))));
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setBmi(null);
    setCategory('');
    setCategoryDetails(null);
    setBodyFat(null);
    setIdealWeight(null);
    setDailyCalories(null);
    setWaterIntake(null);
    setMetabolicAge(null);
  };

  const getBMIColor = (bmiValue: number) => {
    if (bmiValue < 16) return themeColors.primary;
    else if (bmiValue < 18.5) return '#60A5FA';
    else if (bmiValue < 25) return themeColors.success;
    else if (bmiValue < 30) return themeColors.warning;
    else if (bmiValue < 35) return '#F97316';
    else return themeColors.error;
  };

  const exportToPDF = () => {
    if (!isProUser) {
      alert(t('upgrade_to_export', 'Upgrade to Pro to export PDF reports'));
      return;
    }
    
    const reportData = {
      bmi,
      category,
      height,
      weight,
      age,
      gender,
      bodyFat,
      idealWeight,
      dailyCalories,
      waterIntake,
      metabolicAge,
      date: new Date().toLocaleDateString()
    };
    
    alert(t('pdf_generated', 'PDF Report Generated! (Pro Feature)'));
    console.log('PDF Report:', reportData);
  };

  const shareResults = () => {
    const shareText = t('share_text', 'My BMI is {bmi} ({category}). Calculate yours at Centre.com.pk');
    const formattedText = shareText.replace('{bmi}', bmi?.toString() || '').replace('{category}', getTranslatedCategory(category));
    
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'My BMI Results'),
        text: formattedText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${formattedText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearHistoryData = () => {
    clearHistory();
    setHistory([]);
  };

  // Simple chart rendering functions
  const renderSimpleBarChart = () => {
    return (
      <div className="space-y-2">
        {BMICategories.map((cat, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm truncate" style={{ color: themeColors.text.secondary }}>
              {getTranslatedCategory(cat.categoryKey)}
            </div>
            <div className="flex-1">
              <div className="h-6 rounded" style={{ 
                backgroundColor: cat.color + '40',
                width: `${(cat.categoryKey === category ? 100 : 50)}%`,
                transition: 'width 0.3s ease'
              }}>
                <div className="h-full rounded" style={{ 
                  backgroundColor: cat.color,
                  width: '100%'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSimplePieChart = () => {
    const total = BMICategories.reduce((acc, cat) => acc + (cat.categoryKey === category ? 1 : 0.5), 0);
    let accumulated = 0;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        {BMICategories.map((cat, index) => {
          const percentage = (cat.categoryKey === category ? 1 : 0.5) / total * 100;
          const startAngle = accumulated * 3.6;
          accumulated += percentage;
          
          return (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                clipPath: `conic-gradient(transparent ${startAngle}deg, ${cat.color} ${startAngle}deg, ${cat.color} ${startAngle + percentage * 3.6}deg, transparent ${startAngle + percentage * 3.6}deg)`
              }}
            />
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full" style={{ backgroundColor: themeColors.background }} />
        </div>
      </div>
    );
  };

  const renderSimpleLineChart = () => {
    if (history.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm opacity-70" style={{ color: themeColors.text.secondary }}>
            {t('not_enough_data', 'Not enough data for trend chart')}
          </p>
        </div>
      );
    }

    const points = history.slice(0, 5).reverse();
    const values = points.map(p => (p.resultData as any).bmi);
    const min = Math.min(...values) - 2;
    const max = Math.max(...values) + 2;
    const range = max - min;

    return (
      <div className="h-48 relative">
        <svg className="w-full h-full">
          <path
            d={points.map((p, i) => {
              const x = (i / (points.length - 1)) * 100;
              const y = 100 - (((p.resultData as any).bmi - min) / range) * 100;
              return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
            }).join(' ')}
            fill="none"
            stroke={themeColors.primary}
            strokeWidth="2"
          />
          {points.map((p, i) => {
            const x = (i / (points.length - 1)) * 100;
            const y = 100 - (((p.resultData as any).bmi - min) / range) * 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={themeColors.primary}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-background text-text-primary transition-all duration-300"
      style={{ 
        backgroundColor: themeColors.background,
        color: themeColors.text.primary,
        fontFamily: fontFamily
      }}
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
    

        
        {/* Tool Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'BMI Calculator')}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg opacity-80" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Calculate your Body Mass Index with advanced health analytics')}
          </p>
          
          {/* Upgrade Banner for Free Users */}
          {!isProUser && (
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg" 
                 style={{ backgroundColor: themeColors.primary + '20', border: `1px solid ${themeColors.primary}` }}>
              <Crown className="h-4 w-4" style={{ color: themeColors.primary }} />
              <span className="text-sm" style={{ color: themeColors.primary }}>
                <span className="font-semibold">{t('upgrade_to_pro', 'Upgrade to Pro')}</span> {t('for_advanced_analytics', 'for advanced health analytics')}
              </span>
              <button 
                onClick={() => setIsProUser(true)}
                className="ml-2 px-3 py-1 rounded text-sm font-semibold"
                style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
              >
                {t('try_pro_free', 'Try Pro Free')}
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'calculator' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'calculator' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'calculator' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'calculator' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Calculator className="h-4 w-4" />
            {t('calculator', 'Calculator')}
          </button>
          
          <button
            onClick={() => setActiveTab('charts')}
            disabled={!bmi}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${!bmi ? 'opacity-50 cursor-not-allowed' : activeTab === 'charts' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'charts' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'charts' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'charts' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <BarChart3 className="h-4 w-4" />
            {t('charts', 'Charts')}
            {!isProUser && <Lock className="h-3 w-3" />}
          </button>
          
          <button
            onClick={() => setActiveTab('recommendations')}
            disabled={!bmi}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${!bmi ? 'opacity-50 cursor-not-allowed' : activeTab === 'recommendations' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'recommendations' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'recommendations' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'recommendations' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Heart className="h-4 w-4" />
            {t('recommendations', 'Recommendations')}
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
            {t('history', 'History')}
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Input */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: themeColors.text.primary }}>
                  {t('enter_details', 'Enter Your Details')}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Unit System */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('unit_system', 'Unit System')}
                    </label>
                    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                      <button
                        onClick={() => setUnit('metric')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'metric' ? '' : 'opacity-70'}`}
                        style={{
                          backgroundColor: unit === 'metric' ? themeColors.primary : themeColors.background,
                          color: unit === 'metric' ? '#ffffff' : themeColors.text.primary
                        }}
                      >
                        {t('metric', 'Metric (cm, kg)')}
                      </button>
                      <button
                        onClick={() => setUnit('imperial')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'imperial' ? '' : 'opacity-70'}`}
                        style={{
                          backgroundColor: unit === 'imperial' ? themeColors.primary : themeColors.background,
                          color: unit === 'imperial' ? '#ffffff' : themeColors.text.primary
                        }}
                      >
                        {t('imperial', 'Imperial (ft-in, lbs)')}
                      </button>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('gender', 'Gender')}
                    </label>
                    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                      <button
                        onClick={() => setGender('male')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${gender === 'male' ? '' : 'opacity-70'}`}
                        style={{
                          backgroundColor: gender === 'male' ? themeColors.primary : themeColors.background,
                          color: gender === 'male' ? '#ffffff' : themeColors.text.primary
                        }}
                      >
                        {t('male', 'Male')}
                      </button>
                      <button
                        onClick={() => setGender('female')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${gender === 'female' ? '' : 'opacity-70'}`}
                        style={{
                          backgroundColor: gender === 'female' ? themeColors.primary : themeColors.background,
                          color: gender === 'female' ? '#ffffff' : themeColors.text.primary
                        }}
                      >
                        {t('female', 'Female')}
                      </button>
                    </div>
                  </div>

                  {/* Height Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('height', 'Height')} {unit === 'metric' ? '(cm)' : '(feet-inches)'}
                    </label>
                    {unit === 'metric' ? (
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder={t('eg_170', 'e.g., 170')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        style={{
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary,
                        }}
                        min="50"
                        max="300"
                      />
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={height.split('-')[0] || ''}
                          onChange={(e) => setHeight(`${e.target.value}-${height.split('-')[1] || ''}`)}
                          placeholder={t('feet', 'Feet')}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary,
                          }}
                          min="3"
                          max="8"
                        />
                        <input
                          type="number"
                          value={height.split('-')[1] || ''}
                          onChange={(e) => setHeight(`${height.split('-')[0] || ''}-${e.target.value}`)}
                          placeholder={t('inches', 'Inches')}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                          style={{
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary,
                          }}
                          min="0"
                          max="11"
                        />
                      </div>
                    )}
                  </div>

                  {/* Weight Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('weight', 'Weight')} {unit === 'metric' ? '(kg)' : '(lbs)'}
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={unit === 'metric' ? t('eg_70', 'e.g., 70') : t('eg_154', 'e.g., 154')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary,
                      }}
                      min="20"
                      max="300"
                    />
                  </div>

                  {/* Age Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('age', 'Age (years)')}
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={t('eg_30', 'e.g., 30')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary,
                      }}
                      min="2"
                      max="120"
                    />
                  </div>

                  {/* Advanced Toggle */}
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: themeColors.primary }}
                    >
                      <Activity className="h-4 w-4" />
                      {showAdvanced ? t('hide_advanced', 'Hide Advanced Options') : t('show_advanced', 'Show Advanced Options (Pro)')}
                      {!isProUser && <Lock className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Advanced Options (Pro Features) */}
                {showAdvanced && isProUser && (
                  <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Crown className="h-4 w-4" style={{ color: themeColors.primary }} />
                      {t('advanced_metrics', 'Advanced Health Metrics')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>
                          {t('activity_level', 'Activity Level')}
                        </label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg text-sm" 
                          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}
                        >
                          <option>{t('sedentary', 'Sedentary (little exercise)')}</option>
                          <option>{t('lightly_active', 'Lightly active (1-3 days/week)')}</option>
                          <option>{t('moderately_active', 'Moderately active (3-5 days/week)')}</option>
                          <option>{t('very_active', 'Very active (6-7 days/week)')}</option>
                          <option>{t('extra_active', 'Extra active (athlete)')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>
                          {t('goal', 'Goal')}
                        </label>
                        <select 
                          className="w-full px-3 py-2 border rounded-lg text-sm" 
                          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}
                        >
                          <option>{t('maintain_weight', 'Maintain weight')}</option>
                          <option>{t('mild_weight_loss', 'Mild weight loss (0.25 kg/week)')}</option>
                          <option>{t('weight_loss', 'Weight loss (0.5 kg/week)')}</option>
                          <option>{t('extreme_weight_loss', 'Extreme weight loss (1 kg/week)')}</option>
                          <option>{t('weight_gain', 'Weight gain')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                  <button
                    onClick={calculateBMI}
                    disabled={!height || !weight}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      color: '#ffffff'
                    }}
                  >
                    <Calculator className="h-5 w-5" />
                    {t('calculate_bmi', 'Calculate BMI')}
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="py-3 px-4 border rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                    style={{ 
                      borderColor: themeColors.border,
                      color: themeColors.text.secondary
                    }}
                  >
                    <RotateCcw className="h-5 w-5" />
                    {t('reset', 'Reset')}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-4 sm:space-y-6">
              {/* BMI Result Card */}
              <div className="rounded-xl border p-4 sm:p-6 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                {bmi ? (
                  <>
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3" style={{ color: getBMIColor(bmi) }}>
                      {bmi}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold mb-2" style={{ color: getBMIColor(bmi) }}>
                      {getTranslatedCategory(category)}
                    </div>
                    <div className="text-sm opacity-80 mb-4 sm:mb-6" style={{ color: themeColors.text.secondary }}>
                      {t('body_mass_index', 'Body Mass Index')}
                    </div>
                    
                    {categoryDetails && (
                      <div className="text-left text-sm p-3 rounded-lg mb-4" style={{ backgroundColor: getBMIColor(bmi) + '10' }}>
                        <div className="font-medium mb-1" style={{ color: getBMIColor(bmi) }}>
                          {getTranslatedDescription(categoryDetails.descriptionKey)}
                        </div>
                        <div className="opacity-80" style={{ color: themeColors.text.secondary }}>
                          {t('risk', 'Risk')}: <span className="font-medium">{getTranslatedRisk(categoryDetails.riskKey)}</span> • {t('advice', 'Advice')}: {getTranslatedAdvice(categoryDetails.adviceKey)}
                        </div>
                      </div>
                    )}

                    {/* BMI Scale */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1" style={{ color: themeColors.text.secondary }}>
                        <span>{t('underweight', 'Underweight')}</span>
                        <span>{t('normal', 'Normal')}</span>
                        <span>{t('overweight', 'Overweight')}</span>
                        <span>{t('obese', 'Obese')}</span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden">
                        <div 
                          className="h-full"
                          style={{ 
                            background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.success}, ${themeColors.warning}, ${themeColors.error})`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4 sm:mt-6">
                      <button
                        onClick={shareResults}
                        className="py-2 px-3 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                        style={{ 
                          borderColor: themeColors.border,
                          color: themeColors.text.secondary
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        {t('share', 'Share')}
                      </button>
                      <button
                        onClick={exportToPDF}
                        disabled={!isProUser}
                        className="py-2 px-3 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                        style={{ 
                          borderColor: isProUser ? themeColors.primary : themeColors.border,
                          color: isProUser ? themeColors.primary : themeColors.text.secondary
                        }}
                      >
                        <Download className="h-4 w-4" />
                        {t('export_pdf', 'Export PDF')}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 sm:py-12">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                      {t('enter_to_calculate', 'Enter your height and weight to calculate BMI')}
                    </p>
                  </div>
                )}
              </div>

              {/* Advanced Metrics (Pro Features) */}
              {bmi && isProUser && (
                <div className="rounded-xl border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Crown className="h-4 w-4" style={{ color: themeColors.primary }} />
                    {t('advanced_metrics', 'Advanced Health Metrics')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {bodyFat && (
                      <div className="text-center p-2 rounded" style={{ backgroundColor: themeColors.background }}>
                        <div className="text-xs opacity-80" style={{ color: themeColors.text.secondary }}>{t('body_fat', 'Body Fat')}</div>
                        <div className="text-lg font-semibold" style={{ color: themeColors.primary }}>{bodyFat}%</div>
                      </div>
                    )}
                    {idealWeight && (
                      <div className="text-center p-2 rounded" style={{ backgroundColor: themeColors.background }}>
                        <div className="text-xs opacity-80" style={{ color: themeColors.text.secondary }}>{t('ideal_weight', 'Ideal Weight')}</div>
                        <div className="text-lg font-semibold" style={{ color: themeColors.success }}>{idealWeight.min}-{idealWeight.max} kg</div>
                      </div>
                    )}
                    {dailyCalories && (
                      <div className="text-center p-2 rounded" style={{ backgroundColor: themeColors.background }}>
                        <div className="text-xs opacity-80" style={{ color: themeColors.text.secondary }}>{t('daily_calories', 'Daily Calories')}</div>
                        <div className="text-lg font-semibold" style={{ color: themeColors.warning }}>{dailyCalories}</div>
                      </div>
                    )}
                    {waterIntake && (
                      <div className="text-center p-2 rounded" style={{ backgroundColor: themeColors.background }}>
                        <div className="text-xs opacity-80" style={{ color: themeColors.text.secondary }}>{t('water_intake', 'Water Intake')}</div>
                        <div className="text-lg font-semibold" style={{ color: themeColors.primary }}>{waterIntake} L</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick History */}
              {history.length > 0 && (
                <div className="rounded-xl border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold" style={{ color: themeColors.text.primary }}>{t('recent_calculations', 'Recent Calculations')}</h3>
                    <button
                      onClick={clearHistoryData}
                      className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                      style={{ color: themeColors.text.secondary }}
                    >
                      {t('clear', 'Clear')}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((entry) => {
                      const data = entry.resultData;
                      return (
                        <div key={entry.id} className="flex justify-between items-center p-2 rounded text-sm hover:opacity-80 transition-opacity" style={{ backgroundColor: themeColors.background }}>
                          <div>
                            <div style={{ color: themeColors.text.primary }}>{data.bmi} BMI</div>
                            <div className="text-xs opacity-70" style={{ color: themeColors.text.secondary }}>
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded" style={{ 
                            backgroundColor: getBMIColor(data.bmi) + '20',
                            color: getBMIColor(data.bmi)
                          }}>
                            {getTranslatedCategory(data.category)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
            
            {/* ========== 🏥 WHO STANDARDS ========== */}
            {bmi && (
              <div className="mt-8 rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <WHOStandards userBMI={bmi} userCategory={category} />
              </div>
            )}

            {/* ========== 🏥 HEALTH RISK ASSESSMENT ========== */}
            {bmi && (
              <div className="mt-6 rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <HealthRiskAssessment 
                  bmi={bmi} 
                  category={category} 
                  age={age} 
                  gender={gender} 
                />
              </div>
            )}

            {/* ========== 🌍 COUNTRY BMI COMPARISON ========== */}
            {bmi && (
              <div className="mt-6 rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <CountryBMIComparison userBMI={bmi} />
              </div>
            )}
        {/* Charts Tab */}
        {activeTab === 'charts' && bmi && (
          <div className="space-y-6">
            {isProUser ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BMI Category Chart */}
                <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.primary + '20' }}>
                      <PieChartIcon className="h-5 w-5" style={{ color: themeColors.primary }} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('bmi_category_distribution', 'BMI Category Distribution')}</h3>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    {renderSimplePieChart()}
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BMICategories.map((cat, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs truncate" style={{ color: themeColors.text.secondary }}>{getTranslatedCategory(cat.categoryKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BMI Trend Chart */}
                <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.warning + '20' }}>
                      <TrendingUp className="h-5 w-5" style={{ color: themeColors.warning }} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('bmi_progress_over_time', 'BMI Progress Over Time')}</h3>
                  </div>
                  {renderSimpleLineChart()}
                  {history.length > 1 && (
                    <div className="mt-4 text-center text-sm" style={{ color: themeColors.text.secondary }}>
                      {t('showing_last', 'Showing last')} {Math.min(5, history.length)} {t('calculations', 'calculations')}
                    </div>
                  )}
                </div>

                {/* BMI Categories Bar Chart */}
                <div className="lg:col-span-2 rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.success + '20' }}>
                      <BarChart3 className="h-5 w-5" style={{ color: themeColors.success }} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('bmi_categories_comparison', 'BMI Categories Comparison')}</h3>
                  </div>
                  <div className="h-64">
                    {renderSimpleBarChart()}
                  </div>
                  <div className="mt-4 text-sm text-center" style={{ color: themeColors.text.secondary }}>
                    {t('current_category_highlighted', 'Your current category is highlighted')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <Crown className="h-12 w-12 mx-auto mb-4" style={{ color: themeColors.primary }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('upgrade_to_pro_charts', 'Upgrade to Pro for Advanced Charts')}</h3>
                <p className="mb-6 opacity-80" style={{ color: themeColors.text.secondary }}>
                  {t('get_access_charts', 'Get access to detailed health analytics, progress tracking, and interactive charts')}
                </p>
                <button
                  onClick={() => setIsProUser(true)}
                  className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
                >
                  {t('unlock_pro', 'Unlock Pro Features - ₹199/month')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && bmi && (
          <div className="space-y-6">
            {isProUser ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Diet Recommendations */}
                <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.primary + '20' }}>
                      <Heart className="h-5 w-5" style={{ color: themeColors.primary }} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('diet_plan', 'Diet Plan')}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.success }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {dailyCalories ? t('aim_for_calories', 'Aim for {calories} calories daily for weight loss').replace('{calories}', (dailyCalories - 500).toString()) : t('calculate_calories', 'Calculate calories for personalized plan')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.success }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('increase_protein', 'Increase protein intake to 1.6-2.2g per kg of body weight')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.success }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {waterIntake ? t('drink_water', 'Drink {water} liters of water daily').replace('{water}', waterIntake.toString()) : t('stay_hydrated', 'Stay hydrated with 2-3 liters of water daily')}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Exercise Recommendations */}
                <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.warning + '20' }}>
                      <Activity className="h-5 w-5" style={{ color: themeColors.warning }} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('exercise_plan', 'Exercise Plan')}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.warning }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('aerobic_activity', '150 minutes of moderate aerobic activity weekly')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.warning }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('strength_training', 'Strength training 2-3 times per week')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.warning }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('flexibility_exercises', 'Include flexibility exercises daily')}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Health Goals */}
                <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors.success + '20' }}>
                      <Target className="h-5 w-5" style={{ color: themeColors.success }} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>{t('health_goals', 'Health Goals')}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.primary }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {idealWeight ? t('target_weight', 'Target weight: {min}-{max} kg').replace('{min}', idealWeight.min.toString()).replace('{max}', idealWeight.max.toString()) : t('set_weight_goals', 'Set realistic weight goals')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.primary }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('track_progress', 'Track progress weekly with measurements')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: themeColors.primary }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('health_checkups', 'Schedule regular health check-ups')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: themeColors.primary }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('personalized_recommendations', 'Personalized Health Recommendations')}</h3>
                <p className="mb-6 opacity-80" style={{ color: themeColors.text.secondary }}>
                  {t('get_customized_plans', 'Get customized diet plans, exercise routines, and health goals based on your BMI')}
                </p>
                <button
                  onClick={() => setIsProUser(true)}
                  className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
                >
                  {t('unlock_recommendations', 'Unlock Personalized Recommendations')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
            <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: themeColors.text.primary }}>{t('calculation_history', 'Calculation History')}</h2>
                {history.length > 0 && (
                  <button
                    onClick={clearHistoryData}
                    className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ 
                      borderColor: themeColors.error,
                      color: themeColors.error
                    }}
                  >
                    {t('clear_all_history', 'Clear All History')}
                  </button>
                )}
              </div>
            </div>

            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: themeColors.border }}>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: themeColors.text.secondary }}>{t('date', 'Date')}</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: themeColors.text.secondary }}>{t('height', 'Height')}</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: themeColors.text.secondary }}>{t('weight', 'Weight')}</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: themeColors.text.secondary }}>BMI</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: themeColors.text.secondary }}>{t('category', 'Category')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => {
                      const input = entry.inputData;
                      const result = entry.resultData;
                      return (
                        <tr key={entry.id} className="border-b hover:opacity-80 transition-opacity" style={{ borderColor: themeColors.border }}>
                          <td className="p-4 text-sm" style={{ color: themeColors.text.primary }}>
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm" style={{ color: themeColors.text.primary }}>
                            {input.height} {input.unit === 'metric' ? 'cm' : input.unit === 'imperial' ? 'ft-in' : ''}
                          </td>
                          <td className="p-4 text-sm" style={{ color: themeColors.text.primary }}>
                            {input.weight} {input.unit === 'metric' ? 'kg' : 'lbs'}
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                  style={{ 
                                    backgroundColor: getBMIColor(result.bmi) + '20',
                                    color: getBMIColor(result.bmi)
                                  }}>
                              {result.bmi}
                            </span>
                          </td>
                          <td className="p-4 text-sm" style={{ color: themeColors.text.primary }}>
                            {getTranslatedCategory(result.category)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <HistoryIcon className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>{t('no_history', 'No calculation history yet')}</p>
                <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('history_will_appear', 'Your BMI calculations will appear here')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-8 sm:mt-12">
          <div className="prose prose-sm max-w-none" style={{ color: themeColors.text.secondary }}>
            <h3 style={{ color: themeColors.text.primary }}>{t('about_bmi', 'About BMI Calculator')}</h3>
            <p>
              {t('about_bmi_text', 'Body Mass Index (BMI) is a simple calculation using a person\'s height and weight. The formula is BMI = kg/m² where kg is a person\'s weight in kilograms and m² is their height in meters squared. BMI indicates whether a person has a healthy body weight for their height.')}
            </p>
            
            <div style={{ color: themeColors.text.primary }} role="heading" aria-level={4}>{t('bmi_categories', 'BMI Categories')}</div>
            <ul>
              <li><strong>{t('underweight', 'Underweight')}:</strong> {t('bmi_less_than', 'BMI less than 18.5')}</li>
              <li><strong>{t('normal_weight', 'Normal weight')}:</strong> {t('bmi_18_5_to_24_9', 'BMI 18.5 to 24.9')}</li>
              <li><strong>{t('overweight', 'Overweight')}:</strong> {t('bmi_25_to_29_9', 'BMI 25 to 29.9')}</li>
              <li><strong>{t('obesity', 'Obesity')}:</strong> {t('bmi_30_or_greater', 'BMI 30 or greater')}</li>
            </ul>

            <div className="bg-surface border rounded-lg p-4 mt-6" style={{ borderColor: themeColors.border }}>
              <div style={{ color: themeColors.text.primary }} className="mt-0" role="heading" aria-level={4}>{t('important_notes', 'Important Notes')}</div>
              <p className="text-sm">
                {t('important_notes_text', 'While BMI is a useful screening tool, it does not directly measure body fat or account for muscle mass, bone density, overall body composition, and racial and sex differences. For a comprehensive health assessment, consult with a healthcare provider.')}
              </p>
            </div>
          </div>
        </div>
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
      </div>
    </div>
  );

}
