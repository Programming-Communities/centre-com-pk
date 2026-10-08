// components/sections/HeroSection1/HeroSection.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import './HeroSection.css'; // Add this import if using CSS file

export default function HeroSection() {
  const { themeColors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const heroWords = [
    "Educational Tools",
    "Computer Utilities", 
    "Calculators",
    "Converters",
    "Design Tools",
    "Security Tools"
  ];

  return (
    <section 
      className="relative py-20 overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${themeColors.primary}10, ${themeColors.secondary}5, ${themeColors.background})`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${themeColors.primary}40 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                 style={{ backgroundColor: themeColors.primary, color: themeColors.surface }}>
              <span className="text-2xl font-bold">C</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: themeColors.text.primary }}>
              <span className="block">Welcome to</span>
              <span className="block mt-2" style={{ color: themeColors.primary }}>
                Centre.com.pk
              </span>
            </h1>
          </div>

          {/* Animated Words */}
          <div className="h-20 mb-8 flex items-center justify-center">
            <div className="text-3xl md:text-4xl font-bold">
              <span className="inline-block" style={{ color: themeColors.text.secondary }}>
                Free&nbsp;
              </span>
              <div className="inline-block h-12 overflow-hidden">
                <div className="animate-slide-up">
                  {heroWords.map((word, index) => (
                    <div key={index} className="h-12 leading-12"
                         style={{ color: themeColors.primary }}>
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
             style={{ color: themeColors.text.secondary }}>
            Comprehensive collection of <span style={{ color: themeColors.primary }}>55 free tools</span>
            for students, professionals, and everyday users
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tools, calculators, converters..."
                className="w-full px-6 py-4 text-lg rounded-2xl shadow-lg focus:outline-none focus:ring-4 transition-all"
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text.primary,
                  border: `2px solid ${themeColors.border}`,
                  boxShadow: `0 10px 40px ${themeColors.primary}20`,
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-6 py-2 rounded-xl font-semibold transition-transform hover:scale-105"
                style={{
                  backgroundColor: themeColors.primary,
                  color: themeColors.surface,
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/tools"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.surface,
              }}
            >
              Explore All Tools
            </Link>
            <Link
              href="/categories"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{
                backgroundColor: themeColors.surface,
                color: themeColors.text.primary,
                border: `2px solid ${themeColors.border}`,
              }}
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Tools Available', value: '55' },
              { label: 'Categories', value: '25+' },
              { label: 'Monthly Users', value: 'Thousands' },
              { label: 'Free Forever', value: '100%' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl"
                   style={{ backgroundColor: themeColors.surface }}>
                <div className="text-2xl font-bold mb-1"
                     style={{ color: themeColors.primary }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}