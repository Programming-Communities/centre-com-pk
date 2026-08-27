'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, BookOpen, User, Menu } from 'lucide-react';
import { useState } from 'react';
import MobileDashboard from './MobileDashboard/MobileDashboard';

interface BottomNavigationProps {
  lang: string;
}

export default function BottomNavigation({ lang }: BottomNavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: `/${lang}`, icon: Home, label: 'Home' },
    { href: `/${lang}/tools`, icon: Wrench, label: 'Tools' },
    { href: `/${lang}/blog`, icon: BookOpen, label: 'Blog' },
    { href: `/${lang}/auth/signin`, icon: User, label: 'Account' },
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center py-2.5 px-1 transition-all duration-200 ${
                  active ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
                <Icon className={`w-5 h-5 mb-1 ${active ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center py-2.5 px-1 text-text-secondary"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      <MobileDashboard
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        lang={lang}
      />

      <div className="h-16 md:hidden" />
    </>
  );
}
