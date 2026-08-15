// ✅ SERVER COMPONENT — No client JS

interface StatItem {
  number: string;
  label: string;
}

interface StatsSectionProps {
  stats: StatItem[];
  theme?: 'primary' | 'success' | 'warning' | 'error';
  backgroundColor?: 'surface' | 'background' | 'gradient';
  showBorder?: boolean;
  lang: string;
}

export default async function StatsSection({ 
  stats, 
  theme = "primary",
  backgroundColor = "surface",
  showBorder = true,
  lang
}: StatsSectionProps) {
  const defaultStats = stats.length > 0 ? stats : [
    { number: '54+', label: 'Free Tools' },
    { number: '50K+', label: 'Users' },
    { number: '100%', label: 'Free' },
    { number: '24/7', label: 'Available' },
  ];

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ✅ Grid — No animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {defaultStats.map((stat, index) => (
            <div key={index} className="text-center p-4 md:p-6 rounded-xl bg-surface border border-border">
              <div className="text-2xl sm:text-3xl font-bold mb-1 text-primary">
                {stat.number}
              </div>
              <div className="font-medium text-sm text-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
