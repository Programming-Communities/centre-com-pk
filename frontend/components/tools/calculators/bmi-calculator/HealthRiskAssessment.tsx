// components/tools/calculators/bmi-calculator/HealthRiskAssessment.tsx
'use client';

interface HealthRiskAssessmentProps {
  bmi: number;
  category: string;
  age: string;
  gender: string;
}

const HEALTH_RISKS = [
  {
    condition: 'Heart Disease',
    icon: '❤️',
    underweight: 'Low',
    normal: 'Low',
    overweight: 'Moderate',
    obese: 'High',
    description: 'Excess weight strains the heart, increasing risk of cardiovascular disease.'
  },
  {
    condition: 'Type 2 Diabetes',
    icon: '🩸',
    underweight: 'Very Low',
    normal: 'Very Low',
    overweight: 'Moderate',
    obese: 'Very High',
    description: 'Obesity is the leading risk factor for developing Type 2 diabetes.'
  },
  {
    condition: 'Hypertension',
    icon: '💓',
    underweight: 'Low',
    normal: 'Low',
    overweight: 'High',
    obese: 'Very High',
    description: 'High BMI correlates strongly with elevated blood pressure.'
  },
  {
    condition: 'Joint Problems',
    icon: '🦴',
    underweight: 'Low',
    normal: 'Low',
    overweight: 'Moderate',
    obese: 'High',
    description: 'Extra weight puts pressure on joints, especially knees and hips.'
  },
  {
    condition: 'Sleep Apnea',
    icon: '😴',
    underweight: 'Very Low',
    normal: 'Very Low',
    overweight: 'Moderate',
    obese: 'High',
    description: 'Excess neck fat can obstruct breathing during sleep.'
  },
  {
    condition: 'Cancer Risk',
    icon: '🔬',
    underweight: 'Low',
    normal: 'Low',
    overweight: 'Moderate',
    obese: 'Increased',
    description: 'Obesity linked to 13+ types of cancer according to WHO research.'
  }
];

function getRiskLevel(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Very Low': return '#10B981';
    case 'Low': return '#60A5FA';
    case 'Moderate': return '#F59E0B';
    case 'High': return '#F97316';
    case 'Very High': return '#EF4444';
    case 'Increased': return '#DC2626';
    default: return '#6B7280';
  }
}

export default function HealthRiskAssessment({ bmi, category, age, gender }: HealthRiskAssessmentProps) {
  const riskLevel = getRiskLevel(bmi);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-2 text-text-primary">
        🏥 Health Risk Assessment
      </h3>
      <p className="text-sm text-text-secondary text-center mb-6">
        Based on WHO research, here's how your BMI category affects your health risks.
        All data is for educational purposes only.
      </p>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {HEALTH_RISKS.map((risk) => {
          const riskValue = risk[riskLevel] as string;
          const color = getRiskColor(riskValue);
          
          return (
            <div 
              key={risk.condition}
              className="p-4 rounded-xl border hover:shadow-md transition-all"
              style={{ 
                backgroundColor: `${color}08`,
                borderColor: `${color}30`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{risk.icon}</span>
                <div>
                  <h4 className="font-semibold text-sm text-text-primary">{risk.condition}</h4>
                </div>
              </div>
              <div 
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
                style={{ backgroundColor: color, color: '#fff' }}
              >
                Risk: {riskValue}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {risk.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 text-center mt-4">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Disclaimer:</strong> This assessment is for educational purposes only. 
          Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
}