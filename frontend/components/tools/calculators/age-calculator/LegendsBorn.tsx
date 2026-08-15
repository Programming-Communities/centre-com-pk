// components/tools/calculators/age-calculator/LegendsBorn.tsx
'use client';

interface Legend {
  name: string;
  profession: string;
  emoji: string;
  birthDate: string; // MM-DD format
  country: string;
  funFact: string;
}

// Famous people born on each day of the year
const LEGENDS_DATABASE: Record<string, Legend[]> = {
  '01-01': [
    { name: 'J. D. Salinger', profession: 'Author (The Catcher in the Rye)', emoji: '📚', birthDate: '01-01', country: 'USA', funFact: 'Wrote one of the most controversial books of the 20th century' },
  ],
  '01-08': [
    { name: 'Stephen Hawking', profession: 'Theoretical Physicist', emoji: '🔭', birthDate: '01-08', country: 'UK', funFact: 'Wrote "A Brief History of Time" which sold 25M+ copies' },
    { name: 'Elvis Presley', profession: 'King of Rock and Roll', emoji: '🎸', birthDate: '01-08', country: 'USA', funFact: 'Sold over 500 million records worldwide' },
  ],
  '02-12': [
    { name: 'Abraham Lincoln', profession: '16th US President', emoji: '🏛️', birthDate: '02-12', country: 'USA', funFact: 'Abolished slavery in the United States' },
  ],
  '03-14': [
    { name: 'Albert Einstein', profession: 'Physicist (E=mc²)', emoji: '⚡', birthDate: '03-14', country: 'Germany', funFact: 'Won the Nobel Prize in Physics in 1921' },
  ],
  '04-15': [
    { name: 'Leonardo da Vinci', profession: 'Artist & Inventor', emoji: '🎨', birthDate: '04-15', country: 'Italy', funFact: 'Painted the Mona Lisa, the most famous painting in the world' },
  ],
  '06-03': [
    { name: 'Rafael Nadal', profession: 'Tennis Legend', emoji: '🎾', birthDate: '06-03', country: 'Spain', funFact: 'Won 22 Grand Slam titles' },
  ],
  '07-18': [
    { name: 'Nelson Mandela', profession: 'Anti-Apartheid Revolutionary', emoji: '🕊️', birthDate: '07-18', country: 'South Africa', funFact: 'Spent 27 years in prison, then became President' },
  ],
  '08-14': [
    { name: 'Imran Khan', profession: 'Cricketer & Prime Minister', emoji: '🏏', birthDate: '08-14', country: 'Pakistan', funFact: 'Led Pakistan to win the 1992 Cricket World Cup' },
  ],
  '10-11': [
    { name: 'Amitabh Bachchan', profession: 'Legendary Actor', emoji: '🎬', birthDate: '10-11', country: 'India', funFact: 'Starred in over 200 films in a career spanning 5 decades' },
  ],
  '12-25': [
    { name: 'Quaid-e-Azam M.A. Jinnah', profession: 'Founder of Pakistan', emoji: '🇵🇰', birthDate: '12-25', country: 'Pakistan', funFact: 'Created the world\'s first Islamic republic' },
    { name: 'Isaac Newton', profession: 'Physicist & Mathematician', emoji: '🍎', birthDate: '12-25', country: 'UK', funFact: 'Discovered gravity after an apple fell on his head' },
  ],
  '12-31': [
    { name: 'Ben Kingsley', profession: 'Academy Award Winning Actor', emoji: '🏆', birthDate: '12-31', country: 'UK', funFact: 'Won an Oscar for portraying Mahatma Gandhi' },
  ],
};

// Add more dates with famous Pakistani personalities
const PAKISTANI_LEGENDS: Record<string, Legend[]> = {
  '11-09': [
    { name: 'Allama Iqbal', profession: 'Poet of the East', emoji: '✍️', birthDate: '11-09', country: 'Pakistan', funFact: 'Conceived the idea of Pakistan' },
  ],
  '07-12': [
    { name: 'Malala Yousafzai', profession: 'Nobel Peace Prize Winner', emoji: '📖', birthDate: '07-12', country: 'Pakistan', funFact: 'Youngest Nobel Prize laureate in history' },
  ],
};
// Merge all databases
const ALL_LEGENDS: Record<string, Legend[]> = {
  ...LEGENDS_DATABASE,
  ...PAKISTANI_LEGENDS,
};

export default function LegendsBorn({ birthDate }: { birthDate: Date }) {
  const monthDay = `${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
  const legends = ALL_LEGENDS[monthDay] || [];

  if (legends.length === 0) {
    // Show nearby legends
    const nearbyLegends = Object.entries(ALL_LEGENDS)
      .filter(([date]) => {
        const [m, d] = date.split('-').map(Number);
        const legendMonthDay = m * 100 + d;
        const userMonthDay = (birthDate.getMonth() + 1) * 100 + birthDate.getDate();
        return Math.abs(legendMonthDay - userMonthDay) <= 3;
      })
      .flatMap(([, legends]) => legends)
      .slice(0, 3);

    if (nearbyLegends.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center mb-4 text-text-primary">
          ⭐ Legends Born Near Your Birthday
        </h3>
        <div className="grid gap-3">
          {nearbyLegends.map((legend, i) => (
            <LegendCard key={i} legend={legend} isExact={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-4 text-text-primary">
        🎂 Legends Who Share Your Birthday!
      </h3>
      <p className="text-sm text-text-secondary text-center mb-4">
        You share your birthday with {legends.length} amazing {legends.length === 1 ? 'person' : 'people'}!
      </p>
      <div className="grid gap-3">
        {legends.map((legend, i) => (
          <LegendCard key={i} legend={legend} isExact={true} />
        ))}
      </div>
    </div>
  );
}

function LegendCard({ legend, isExact }: { legend: Legend; isExact: boolean }) {
  return (
    <div 
      className="p-4 rounded-xl border hover:shadow-md transition-all"
      style={{ 
        backgroundColor: isExact ? 'rgba(var(--primary-rgb, 37, 99, 235), 0.05)' : 'var(--surface)',
        borderColor: isExact ? 'rgba(var(--primary-rgb, 37, 99, 235), 0.3)' : 'var(--border)'
      }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{legend.emoji}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-text-primary text-lg">{legend.name}</h4>
          <p className="text-sm text-text-secondary">{legend.profession}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {legend.country}
            </span>
            {isExact && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Same Birthday! 🎉
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-text-secondary mt-3 italic border-t pt-2" style={{ borderColor: 'var(--border)' }}>
        💡 {legend.funFact}
      </p>
    </div>
  );
}