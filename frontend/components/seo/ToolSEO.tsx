'use client';

// ToolSEO - COMPLETELY DISABLED
// All extra content (Key Features, How It Works, Why Choose Our Tool)
// removed from tool pages per client request.
// Only tool interface remains.

export default function ToolSEO({ toolData, showFAQs = true }: any) {
  // Return nothing — all extra content removed
  return null;
}

// 'use client';

// import { useTheme } from '@/components/theme';
// import { BarChart3, TrendingUp, Users, Clock, Target, Award, Zap, CheckCircle } from 'lucide-react';

// interface ToolSEOProps {
//   toolData: {
//     title: string;
//     description: string;
//     category: string;
//   };
//   showFAQs?: boolean;
// }

// export default function ToolSEO({ toolData, showFAQs = true }: ToolSEOProps) {
//   const { themeColors } = useTheme();
  
//   return (
//     <div className="space-y-6">
//       {/* Main SEO Content Block */}
//       <div 
//         className="rounded-xl p-6"
//         style={{ 
//           backgroundColor: themeColors.surface,
//           border: `1px solid ${themeColors.border}`
//         }}
//       >
//         {/* ✅ FIXED: Removed hardcoded "Calculate Your Exact Age Online" */}
//         <h2 className="text-xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
//           {toolData.title}
//         </h2>
        
//         <p className="text-base leading-relaxed" style={{ color: themeColors.text.secondary }}>
//           {toolData.description}
//         </p>
//       </div>
      
//       {/* Features Grid */}
//       <div 
//         className="rounded-xl p-6"
//         style={{ 
//           backgroundColor: themeColors.surface,
//           border: `1px solid ${themeColors.border}`
//         }}
//       >
//         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
//           <Zap className="h-5 w-5" style={{ color: themeColors.primary }} />
//           Key Features
//         </h3>
        
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {[
//             { label: '100% Free', icon: <CheckCircle className="h-4 w-4" />, color: themeColors.success },
//             { label: 'No Registration', icon: <CheckCircle className="h-4 w-4" />, color: themeColors.success },
//             { label: 'Privacy First', icon: <Shield className="h-4 w-4" />, color: themeColors.primary },
//             { label: 'Multi-Language', icon: <Globe className="h-4 w-4" />, color: themeColors.primary },
//             { label: 'RTL Support', icon: <Languages className="h-4 w-4" />, color: themeColors.primary },
//             { label: 'Fast & Accurate', icon: <Zap className="h-4 w-4" />, color: themeColors.warning }
//           ].map((feature, idx) => (
//             <div 
//               key={idx} 
//               className="flex items-center gap-2 p-2 rounded-lg"
//               style={{ backgroundColor: `${themeColors.background}80` }}
//             >
//               <span style={{ color: feature.color }}>{feature.icon}</span>
//               <span className="text-sm" style={{ color: themeColors.text.primary }}>{feature.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* How It Works */}
//       <div 
//         className="rounded-xl p-6"
//         style={{ 
//           backgroundColor: themeColors.surface,
//           border: `1px solid ${themeColors.border}`
//         }}
//       >
//         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
//           <Target className="h-5 w-5" style={{ color: themeColors.primary }} />
//           How It Works
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {[
//             { step: 1, title: 'Enter Input', description: 'Provide your data or upload files' },
//             { step: 2, title: 'Process', description: 'Click the action button' },
//             { step: 3, title: 'Get Results', description: 'View or download your results instantly' }
//           ].map((step) => (
//             <div 
//               key={step.step} 
//               className="text-center p-4 rounded-lg"
//               style={{ backgroundColor: `${themeColors.background}80` }}
//             >
//               <div 
//                 className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
//                 style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
//               >
//                 {step.step}
//               </div>
//               <h4 className="font-semibold mb-1" style={{ color: themeColors.text.primary }}>{step.title}</h4>
//               <p className="text-sm" style={{ color: themeColors.text.secondary }}>{step.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* Why Choose Us */}
//       <div 
//         className="rounded-xl p-6"
//         style={{ 
//           backgroundColor: `${themeColors.primary}10`,
//           border: `1px solid ${themeColors.primary}30`
//         }}
//       >
//         <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.primary }}>
//           <Award className="h-5 w-5" />
//           Why Choose Our Tool?
//         </h3>
        
//         <div className="space-y-3">
//           {[
//             '🏆 Most accurate results with advanced algorithms',
//             '⚡ Lightning-fast processing with zero server delay',
//             '🔒 100% private - all processing done in your browser',
//             '🌍 Multi-language support (English, Urdu, Hindi, Arabic)',
//             '📊 Detailed output with export and sharing options'
//           ].map((reason, idx) => (
//             <div key={idx} className="flex items-start gap-2">
//               <span className="text-lg">✅</span>
//               <span className="text-sm" style={{ color: themeColors.text.primary }}>{reason}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper components for icons
// function Shield(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//     </svg>
//   );
// }

// function Globe(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="12" cy="12" r="10" />
//       <line x1="2" y1="12" x2="22" y2="12" />
//       <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//     </svg>
//   );
// }

// function Languages(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M5 8h10" />
//       <path d="M2 4h14" />
//       <path d="M7 12h8" />
//       <path d="M4 16h10" />
//       <path d="M9 20h6" />
//       <path d="M16 4l2 6 2-6" />
//       <path d="M20 10h-4" />
//     </svg>
//   );
// }