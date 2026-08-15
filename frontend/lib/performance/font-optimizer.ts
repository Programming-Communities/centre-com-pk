// lib/performance/font-optimizer.ts
// Font loading optimization

// ✅ Preload critical fonts in layout.tsx:
// <link rel="preload" href="/fonts/JameelNooriNastaleeq.woff2" as="font" type="font/woff2" crossorigin="anonymous" />

// ✅ Use font-display: swap in CSS
// @font-face {
//   font-family: 'Jameel Noori Nastaleeq';
//   src: url('/fonts/JameelNooriNastaleeq.woff2') format('woff2');
//   font-display: swap;
// }

// ✅ Subset Urdu font (only needed characters)
// Use glyphhanger or fonttools to create subsets
