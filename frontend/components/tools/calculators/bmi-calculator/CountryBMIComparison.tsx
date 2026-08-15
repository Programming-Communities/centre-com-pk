// components/tools/calculators/bmi-calculator/CountryBMIComparison.tsx
'use client';

interface CountryBMIComparisonProps {
  userBMI: number;
}

const COUNTRY_BMI_DATA = [
  { country: '🇵🇰 Pakistan', avgBMI: 23.4, male: 23.1, female: 23.7, rank: 'Moderate' },
  { country: '🇮🇳 India', avgBMI: 21.9, male: 21.8, female: 22.0, rank: 'Low' },
  { country: '🇺🇸 USA', avgBMI: 28.8, male: 29.0, female: 28.6, rank: 'High' },
  { country: '🇬🇧 UK', avgBMI: 27.3, male: 27.5, female: 27.0, rank: 'High' },
  { country: '🇨🇳 China', avgBMI: 23.9, male: 24.2, female: 23.6, rank: 'Moderate' },
  { country: '🇯🇵 Japan', avgBMI: 22.6, male: 23.0, female: 22.1, rank: 'Low' },
  { country: '🇧🇩 Bangladesh', avgBMI: 21.0, male: 20.8, female: 21.2, rank: 'Low' },
  { country: '🇦🇪 UAE', avgBMI: 27.1, male: 27.3, female: 26.8, rank: 'High' },
  { country: '🇸🇦 Saudi Arabia', avgBMI: 27.5, male: 27.8, female: 27.1, rank: 'High' },
  { country: '🇦🇫 Afghanistan', avgBMI: 21.6, male: 21.4, female: 21.8, rank: 'Low' },
  { country: '🇳🇵 Nepal', avgBMI: 21.8, male: 21.6, female: 22.0, rank: 'Low' },
  { country: '🇧🇷 Brazil', avgBMI: 25.4, male: 25.2, female: 25.7, rank: 'Moderate' },
];

export default function CountryBMIComparison({ userBMI }: CountryBMIComparisonProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-2 text-text-primary">
        🌍 Your BMI Compared to Different Countries
      </h3>
      <p className="text-sm text-text-secondary text-center mb-6">
        See how your BMI compares to national averages. Data sourced from WHO Global Health Observatory.
      </p>

      {/* Comparison Chart */}
      <div className="space-y-2">
        {COUNTRY_BMI_DATA.map((country) => {
          const barWidth = Math.min((country.avgBMI / 35) * 100, 100);
          const isAbove = userBMI > country.avgBMI;
          const isClose = Math.abs(userBMI - country.avgBMI) < 1;
          
          return (
            <div key={country.country} className="flex items-center gap-3 group">
              {/* Country name */}
              <div className="w-24 sm:w-32 text-sm font-medium text-text-primary shrink-0 truncate">
                {country.country}
              </div>
              
              {/* Bar */}
              <div className="flex-1 relative h-8">
                {/* Country average bar */}
                <div 
                  className="absolute top-0 h-full rounded-r-lg flex items-center transition-all group-hover:opacity-80"
                  style={{ 
                    width: `${barWidth}%`,
                    backgroundColor: 'var(--primary)',
                    opacity: 0.3
                  }}
                />
                
                {/* User marker */}
                {userBMI > 0 && (
                  <div 
                    className="absolute top-0 h-full flex items-center"
                    style={{ 
                      left: `${Math.min((userBMI / 35) * 100, 100)}%`,
                    }}
                  >
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <div className="text-xs font-bold text-primary ml-2 bg-primary/10 px-1.5 py-0.5 rounded">
                      You: {userBMI}
                    </div>
                  </div>
                )}
                
                {/* Country avg label */}
                <div className="absolute top-0 h-full flex items-center text-xs text-text-secondary"
                     style={{ left: `calc(${barWidth}% + 4px)` }}>
                  {country.avgBMI}
                </div>
              </div>
              
              {/* Rank badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                country.rank === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                country.rank === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {country.rank}
              </span>
            </div>
          );
        })}
      </div>

      {/* BMI Legend */}
      <div className="flex justify-center gap-4 text-xs text-text-secondary mt-4 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" /> Low (&lt;22)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" /> Moderate (22-25)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" /> High (&gt;25)
        </div>
      </div>

      <p className="text-xs text-text-secondary text-center mt-4 italic">
        💡 Interesting fact: Pakistan's average BMI has increased by 2.5 points in the last 30 years due to dietary changes.
      </p>
    </div>
  );
}