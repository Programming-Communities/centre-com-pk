/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        // ========== BASE (0px+) ==========
        'all': '0px',
        
        // ========== LEGACY/OLD PHONES (0-279px) ==========
        'mini': '160px',
        'nano': '200px',
        'pico': '240px',
        
        // ========== SMALL PHONES (280-359px) ==========
        'fold': '280px',
        'watch': '320px',
        'moto': '340px',
        
        // ========== ANDROID SMALL (360-374px) ==========
        'android-xs': '360px',
        
        // ========== iPHONE SE & MEDIUM (375-389px) ==========
        'iphone-se': '375px',
        'android-sm': '375px',
        
        // ========== iPHONE 12-16 SERIES (390-413px) ==========
        'iphone-12': '390px',
        'pixel': '393px',
        'android-md': '414px',
        
        // ========== LARGE PHONES (414-479px) ==========
        'iphone-plus': '430px',
        'android-lg': '440px',
        'phablet': '460px',
        
        // ========== PHONE LANDSCAPE (480-639px) ==========
        'mobile-landscape': '480px',
        'sm-landscape': '520px',
        'surface-duo': '540px',
        'md-landscape': '568px',
        'lg-landscape': '600px',
        'kindle': '600px',
        
        // ========== SMALL TABLETS (640-767px) ==========
        'tablet-xs': '640px',
        'nexus': '712px',
        
        // ========== MEDIUM TABLETS (768-833px) ==========
        'ipad-mini': '768px',
        'ipad': '768px',
        'tablet': '768px',
        'ipad-air': '820px',
        'ipad-pro-11': '834px',
        
        // ========== LARGE TABLETS & FOLDABLES (896-1023px) ==========
        'fold-open': '896px',
        'tablet-lg': '900px',
        'surface': '912px',
        
        // ========== iPAD PRO & SMALL LAPTOPS (1024-1279px) ==========
        'ipad-pro-129': '1024px',
        'desktop-sm': '1024px',
        'laptop-xs': '1080px',
        'surface-pro': '1152px',
        'desktop': '1200px',
        'laptop-sm': '1280px',
        
        // ========== STANDARD LAPTOPS (1280-1439px) ==========
        'laptop': '1366px',
        'laptop-md': '1400px',
        
        // ========== LARGE LAPTOPS (1440-1679px) ==========
        'laptop-lg': '1440px',
        'macbook-16': '1536px',
        'desktop-md': '1600px',
        
        // ========== HD+ DESKTOPS (1680-1919px) ==========
        'desktop-hd': '1680px',
        'desktop-lg': '1800px',
        
        // ========== FULL HD DESKTOPS (1920-2047px) ==========
        'desktop-fhd': '1920px',
        
        // ========== 2K DISPLAYS (2048-2559px) ==========
        'desktop-2k': '2048px',
        'imac-4k': '2160px',
        
        // ========== 4K DISPLAYS (2560-3439px) ==========
        'desktop-4k': '2560px',
        'imac-5k': '2880px',
        'cinema-2k': '3200px',
        
        // ========== ULTRAWIDE (3440-3839px) ==========
        'ultrawide': '3440px',
        
        // ========== 4K+ CINEMA (3840-7679px) ==========
        'cinema': '3840px',
        'pro-xdr': '4096px',
        'desktop-5k': '5120px',
        'desktop-6k': '5760px',
        
        // ========== 8K+ DISPLAYS (7680px+) ==========
        'desktop-8k': '7680px',
        'desktop-10k': '8192px',
      },
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-accent': 'var(--text-accent)',
      },
      backgroundColor: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
      textColor: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-accent': 'var(--text-accent)',
      },
      borderColor: {
        border: 'var(--border)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
      boxShadow: {
        'theme': 'var(--shadow)',
      },
      fontFamily: {
        sans: ['var(--font-family)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      zIndex: {
        '1000': '1000',
        '1001': '1001',
        '1002': '1002',
      }
    },
  },
  plugins: [],
}