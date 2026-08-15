import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  href: string;
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  green: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
};

export default function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const colors = colorMap[stat.color] || colorMap.blue;
        const isPositive = stat.change.startsWith('+');
        
        return (
          <Link
            key={stat.title}
            href={stat.href}
            className={`${colors.bg} ${colors.border} border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} this month
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
