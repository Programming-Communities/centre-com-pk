// components/tools/calculators/age-calculator/PlanetAges.tsx
'use client';

interface PlanetAgesProps {
  ageInYears: number;
}

interface PlanetData {
  name: string;
  emoji: string;
  orbitalPeriod: number; // Earth days
  color: string;
  funFact: string;
}

const PLANETS: PlanetData[] = [
  { name: 'Mercury', emoji: '☿️', orbitalPeriod: 88, color: '#A0522D', funFact: 'A year on Mercury is just 88 Earth days!' },
  { name: 'Venus', emoji: '♀️', orbitalPeriod: 225, color: '#DEB887', funFact: 'Venus rotates backwards compared to Earth!' },
  { name: 'Earth', emoji: '🌍', orbitalPeriod: 365.25, color: '#4B9CD3', funFact: 'Your home planet! 🌎' },
  { name: 'Mars', emoji: '♂️', orbitalPeriod: 687, color: '#CD5C5C', funFact: 'Mars has the largest volcano in the solar system!' },
  { name: 'Jupiter', emoji: '♃', orbitalPeriod: 4333, color: '#DAA520', funFact: 'Jupiter is so big that 1,300 Earths could fit inside!' },
  { name: 'Saturn', emoji: '♄', orbitalPeriod: 10759, color: '#F4A460', funFact: 'Saturn\'s rings are made of ice and rock!' },
  { name: 'Uranus', emoji: '⛢', orbitalPeriod: 30687, color: '#87CEEB', funFact: 'Uranus rotates on its side!' },
  { name: 'Neptune', emoji: '♆', orbitalPeriod: 60190, color: '#4169E1', funFact: 'Neptune has the strongest winds in the solar system!' },
];

export default function PlanetAges({ ageInYears }: PlanetAgesProps) {
  const calculatePlanetAge = (orbitalPeriod: number): number => {
    const earthDays = ageInYears * 365.25;
    return earthDays / orbitalPeriod;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-4 text-text-primary">
        🌍 Your Age on Other Planets
      </h3>
      <p className="text-sm text-text-secondary text-center mb-6">
        Because each planet takes a different time to orbit the Sun, your age changes on every planet!
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLANETS.filter(p => p.name !== 'Earth').map((planet) => {
          const age = calculatePlanetAge(planet.orbitalPeriod);
          return (
            <div
              key={planet.name}
              className="p-4 rounded-xl text-center border hover:shadow-lg transition-all cursor-default"
              style={{ 
                backgroundColor: `${planet.color}10`,
                borderColor: `${planet.color}30`
              }}
              title={planet.funFact}
            >
              <div className="text-3xl mb-2">{planet.emoji}</div>
              <div className="text-lg font-bold text-text-primary">
                {age < 1 ? age.toFixed(2) : age.toFixed(1)}
              </div>
              <div className="text-xs text-text-secondary mt-1">years old</div>
              <div className="text-sm font-semibold mt-2" style={{ color: planet.color }}>
                on {planet.name}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-text-secondary text-center mt-4 italic">
        💡 Hover over each planet to learn a fun fact!
      </p>
    </div>
  );
}