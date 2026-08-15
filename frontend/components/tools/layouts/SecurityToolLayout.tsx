// 'use client';
// import { ReactNode } from 'react';
// import { useTheme } from '@/components/theme/contexts/ThemeContext';
// import Link from 'next/link';
// import { BookOpen, ArrowRight } from 'lucide-react';

// interface Props { toolSlug: string; category: string; title: string; description: string; children: ReactNode; lang: string; }

// export default function SecurityToolLayout({ toolSlug, category, title, description, children, lang }: Props) {
//   const { themeColors } = useTheme();
//   const isRTL = lang === 'ur' || lang === 'ar';
//   return (
//     <div style={{ backgroundColor: themeColors?.background, direction: isRTL ? 'rtl' : 'ltr' }}>
//       <div className="text-center py-8 px-4" style={{ background: `linear-gradient(135deg, ${themeColors?.primary}10, ${themeColors?.primary}05)` }}>
//         <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: themeColors?.text?.primary }}>{title}</h1>
//         <p className="text-lg max-w-2xl mx-auto" style={{ color: themeColors?.text?.secondary }}>{description}</p>
//       </div>
//       <div className="max-w-5xl mx-auto px-4 -mt-4">
//         <div className="rounded-2xl shadow-xl border p-6 md:p-8" style={{ backgroundColor: themeColors?.surface, borderColor: themeColors?.border }}>{children}</div>
//       </div>
//       <section className="max-w-3xl mx-auto px-4 py-6">
//         <Link href={`/${lang}/blog/${toolSlug}-complete-guide`} className="flex items-center justify-between p-5 rounded-xl border" style={{ borderColor: themeColors?.primary + '30', backgroundColor: themeColors?.primary + '08', textDecoration: 'none' }}>
//           <div className="flex items-center gap-3"><BookOpen size={24} style={{ color: themeColors?.primary }} /><div><h3 className="font-bold" style={{ color: themeColors?.text?.primary }}>📖 Complete Guide</h3><p className="text-sm" style={{ color: themeColors?.text?.secondary }}>Learn everything about {title}</p></div></div>
//           <ArrowRight size={20} style={{ color: themeColors?.primary }} />
//         </Link>
//       </section>
//     </div>
//   );
// }
