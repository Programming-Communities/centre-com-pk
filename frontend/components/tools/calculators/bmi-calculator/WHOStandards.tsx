// components/tools/calculators/bmi-calculator/WHOStandards.tsx
'use client';

interface WHOStandardsProps {
  userBMI: number;
  userCategory: string;
}

const WHO_CATEGORIES = [
  { 
    category: 'Severely Underweight', 
    range: '< 16', 
    color: '#3B82F6',
    risk: 'Extreme health risk',
    description: 'Significantly below healthy weight. Immediate medical consultation recommended.',
    icon: '⚠️'
  },
  { 
    category: 'Underweight', 
    range: '16 - 18.4', 
    color: '#60A5FA',
    risk: 'Moderate health risk',
    description: 'Below healthy weight range. Consider nutritional assessment.',
    icon: '📉'
  },
  { 
    category: 'Normal Weight', 
    range: '18.5 - 24.9', 
    color: '#10B981',
    risk: 'Lowest health risk',
    description: 'Healthy weight range. Maintain current lifestyle and diet.',
    icon: '✅'
  },
  { 
    category: 'Overweight', 
    range: '25 - 29.9', 
    color: '#F59E0B',
    risk: 'Increased health risk',
    description: 'Above healthy weight. Consider lifestyle modifications.',
    icon: '⚠️'
  },
  { 
    category: 'Obese Class I', 
    range: '30 - 34.9', 
    color: '#F97316',
    risk: 'High health risk',
    description: 'Moderate obesity. Medical consultation recommended.',
    icon: '🔶'
  },
  { 
    category: 'Obese Class II', 
    range: '35 - 39.9', 
    color: '#EF4444',
    risk: 'Very high health risk',
    description: 'Severe obesity. Immediate lifestyle changes needed.',
    icon: '🔴'
  },
  { 
    category: 'Obese Class III', 
    range: '≥ 40', 
    color: '#DC2626',
    risk: 'Extreme health risk',
    description: 'Morbid obesity. Urgent medical attention required.',
    icon: '🚨'
  }
];

export default function WHOStandards({ userBMI, userCategory }: WHOStandardsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-2 text-text-primary">
        🏥 WHO BMI Classification Standards
      </h3>
      <p className="text-sm text-text-secondary text-center mb-6">
        World Health Organization (WHO) standard BMI categories used globally by healthcare professionals.
      </p>
      
      {/* Color Scale Bar */}
      <div className="w-full h-4 rounded-full overflow-hidden flex">
        <div style={{ width: '11%', backgroundColor: '#3B82F6' }} title="Severely Underweight" />
        <div style={{ width: '16%', backgroundColor: '#60A5FA' }} title="Underweight" />
        <div style={{ width: '40%', backgroundColor: '#10B981' }} title="Normal Weight" />
        <div style={{ width: '13%', backgroundColor: '#F59E0B' }} title="Overweight" />
        <div style={{ width: '8%', backgroundColor: '#F97316' }} title="Obese I" />
        <div style={{ width: '6%', backgroundColor: '#EF4444' }} title="Obese II" />
        <div style={{ width: '6%', backgroundColor: '#DC2626' }} title="Obese III" />
      </div>
      <div className="flex justify-between text-xs text-text-secondary px-1">
        <span>16</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>35</span>
        <span>40</span>
      </div>

      {/* Your Position Indicator */}
      {userBMI > 0 && (
        <div className="relative h-8 mt-2">
          <div 
            className="absolute -translate-x-1/2 flex flex-col items-center"
            style={{ 
              left: `${Math.min(Math.max((userBMI / 45) * 100, 2), 98)}%`,
              transition: 'left 0.5s ease-out'
            }}
          >
            <div className="text-lg">📍</div>
            <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              You: {userBMI}
            </div>
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {WHO_CATEGORIES.slice(0, 4).map((cat) => (
          <div 
            key={cat.category}
            className={`p-4 rounded-xl border text-center transition-all ${
              userCategory.includes(cat.category.split(' ')[0].toLowerCase()) 
                ? 'ring-2 scale-105' 
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{ 
              backgroundColor: `${cat.color}10`,
              borderColor: userCategory.includes(cat.category.split(' ')[0].toLowerCase()) 
                ? cat.color 
                : 'var(--border)',
              boxShadow: `0 0 0 2px ${cat.color}`
            }}
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <div className="font-bold text-sm mb-1" style={{ color: cat.color }}>
              {cat.category}
            </div>
            <div className="text-xs text-text-secondary mb-2">{cat.range}</div>
            <div className="text-xs text-text-secondary">{cat.risk}</div>
            {userCategory.includes(cat.category.split(' ')[0].toLowerCase()) && (
              <div 
                className="mt-2 text-xs font-bold px-2 py-1 rounded-full inline-block"
                style={{ backgroundColor: cat.color, color: '#fff' }}
              >
                YOU ARE HERE
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}