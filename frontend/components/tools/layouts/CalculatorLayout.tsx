// 'use client';
// import { ReactNode } from 'react';
// import { useTheme } from '@/components/theme/contexts/ThemeContext';
// import { Calculator } from 'lucide-react';

// interface Props {
//   toolSlug: string;
//   category: string;
//   title: string;
//   description: string;
//   children: ReactNode;
//   lang: string;
// }

// export default function CalculatorLayout({
//   toolSlug,
//   category,
//   title,
//   description,
//   children,
//   lang
// }: Props) {
//   const { themeColors } = useTheme();
//   const isRTL = lang === 'ur' || lang === 'ar';

//   return (
//     <div style={{ backgroundColor: themeColors?.background, direction: isRTL ? 'rtl' : 'ltr' }}>
//       {/* Header */}
//       <div
//         className="text-center py-8 px-4"
//         style={{
//           background: `linear-gradient(135deg, ${themeColors?.primary}10, ${themeColors?.primary}05)`
//         }}
//       >
//         <div
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
//           style={{
//             backgroundColor: themeColors?.primary + '15',
//             color: themeColors?.primary,
//             fontSize: '14px',
//             fontWeight: 600
//           }}
//         >
//           <Calculator size={18} /> Free Calculator
//         </div>
//         <h1
//           className="text-3xl md:text-4xl font-bold mb-3"
//           style={{ color: themeColors?.text?.primary }}
//         >
//           {title}
//         </h1>
//         <p
//           className="text-lg max-w-2xl mx-auto"
//           style={{ color: themeColors?.text?.secondary }}
//         >
//           {description}
//         </p>
//       </div>

//       {/* Tool Interface */}
//       <div className="max-w-4xl mx-auto px-4 -mt-4">
//         <div
//           className="rounded-2xl shadow-xl border p-6 md:p-8"
//           style={{
//             backgroundColor: themeColors?.surface,
//             borderColor: themeColors?.border
//           }}
//         >
//           {children}
//         </div>
//       </div>

//       {/* ❌ Key Features — REMOVED */}
//       {/* ❌ Formula — REMOVED */}
//       {/* ❌ Was this helpful? — REMOVED */}
//       {/* ❌ Complete Guide — REMOVED */}
//       {/* ❌ Related Tools — REMOVED */}
//     </div>
//   );
// }