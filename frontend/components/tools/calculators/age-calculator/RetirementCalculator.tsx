// components/tools/calculators/age-calculator/RetirementCalculator.tsx
'use client';

interface RetirementCalculatorProps {
  birthYear: number;
  currentAge: number;
}

export default function RetirementCalculator({ birthYear, currentAge }: RetirementCalculatorProps) {
  const retirementAge = 60; // Pakistan retirement age
  const retirementYear = birthYear + retirementAge;
  const yearsUntilRetirement = retirementAge - currentAge;
  
  const retirementDate = new Date();
  retirementDate.setFullYear(retirementYear);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-4 text-text-primary">
        💼 Your Retirement Timeline
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl text-center border bg-primary/5 border-primary/20">
          <div className="text-4xl mb-2">🏦</div>
          <div className="text-3xl font-bold text-primary">{retirementYear}</div>
          <div className="text-sm text-text-secondary mt-1">Retirement Year</div>
        </div>
        
        {yearsUntilRetirement > 0 ? (
          <div className="p-5 rounded-xl text-center border bg-warning/5 border-warning/20">
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-warning">{yearsUntilRetirement}</div>
            <div className="text-sm text-text-secondary mt-1">Years Until Retirement</div>
          </div>
        ) : (
          <div className="p-5 rounded-xl text-center border bg-success/5 border-success/20">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-2xl font-bold text-success">Retired!</div>
            <div className="text-sm text-text-secondary mt-1">Enjoy your retirement!</div>
          </div>
        )}
        
        <div className="p-5 rounded-xl text-center border bg-surface">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-xl font-bold text-text-primary">
            {retirementDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
          <div className="text-sm text-text-secondary mt-1">Retirement Month</div>
        </div>
      </div>

      {/* Age in Future Years */}
      <h4 className="text-lg font-semibold text-center mt-6 mb-3 text-text-primary">
        🔮 Your Age in Future Years
      </h4>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {[5, 10, 15, 20, 25].map(years => (
          <div key={years} className="p-3 rounded-lg text-center border bg-surface hover:shadow-md transition-all">
            <div className="text-xs text-text-secondary mb-1">In {years} years</div>
            <div className="text-xl font-bold text-primary">{currentAge + years}</div>
            <div className="text-xs text-text-secondary">years old</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-secondary text-center mt-4 italic">
        💡 Pakistan's official retirement age is 60 years for government employees.
      </p>
    </div>
  );
}