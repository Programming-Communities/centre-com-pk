// components/sections/SponsorsSection/SponsorsSection.tsx
"use client";

import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

interface SponsorsSectionProps {
  sponsors: Sponsor[];
  title?: string;
  description?: string;
}

export default function SponsorsSection({ 
  sponsors,
  title = "Trusted By",
  description = "Our partners and sponsors who support our mission"
}: SponsorsSectionProps) {
  const { themeColors } = useTheme();

  // Fallback sponsors if none provided
  const displaySponsors = sponsors.length > 0 ? sponsors : [
    { name: 'Google', logo: '/sponsors/google.svg', url: 'https://google.com' },
    { name: 'Microsoft', logo: '/sponsors/microsoft.svg', url: 'https://microsoft.com' },
    { name: 'GitHub', logo: '/sponsors/github.svg', url: 'https://github.com' },
    { name: 'Vercel', logo: '/sponsors/vercel.svg', url: 'https://vercel.com' },
    { name: 'Cloudflare', logo: '/sponsors/cloudflare.svg', url: 'https://cloudflare.com' },
    { name: 'DigitalOcean', logo: '/sponsors/digitalocean.svg', url: 'https://digitalocean.com' },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: themeColors.text.primary }}>
            {title}
          </h2>
          <p className="text-lg max-w-2xl mx-auto"
             style={{ color: themeColors.text.secondary }}>
            {description}
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {displaySponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="aspect-square rounded-2xl flex items-center justify-center p-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                   style={{
                     backgroundColor: themeColors.surface,
                     border: `1px solid ${themeColors.border}`,
                   }}>
                {/* Placeholder for sponsor logos */}
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    {getSponsorIcon(sponsor.name)}
                  </div>
                  <div className="text-lg font-semibold"
                       style={{ color: themeColors.text.primary }}>
                    {sponsor.name}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Partnership Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-xl"
               style={{
                 backgroundColor: themeColors.primary + '10',
                 border: `1px solid ${themeColors.primary + '30'}`,
               }}>
            <div className="text-2xl">🤝</div>
            <div>
              <div className="font-semibold" style={{ color: themeColors.primary }}>
                Want to partner with us?
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Contact us for sponsorship opportunities
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getSponsorIcon(name: string): string {
  const iconMap: Record<string, string> = {
    'Google': '🔍',
    'Microsoft': '💻',
    'GitHub': '🐙',
    'Vercel': '▲',
    'Cloudflare': '🌩️',
    'DigitalOcean': '🐬',
    'Amazon': '📦',
    'Facebook': '👥',
    'Twitter': '🐦',
    'LinkedIn': '💼',
  };
  return iconMap[name] || '⭐';
}