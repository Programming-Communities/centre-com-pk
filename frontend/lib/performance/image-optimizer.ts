// lib/performance/image-optimizer.ts
// Image optimization patterns

export const imageOptimization = {
  // ✅ Use next/image for all images
  nextImage: `import Image from 'next/image'`,
  
  // ✅ Always specify width/height
  dimensions: `width={800} height={600}`,
  
  // ✅ Use WebP format
  format: `format: 'webp'`,
  
  // ✅ Lazy load below-the-fold images
  lazyLoading: `loading="lazy"`,
  
  // ✅ Responsive images
  responsive: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`,
  
  // ✅ Blur placeholder
  blur: `placeholder="blur" blurDataURL="data:image/jpeg;base64,..."`,
};
