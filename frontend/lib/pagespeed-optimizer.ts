// Common fixes for PageSpeed/Lighthouse errors
export const PageSpeedOptimizer = {
  // Fix CLS (Cumulative Layout Shift)
  fixCLS: () => {
    // 1. Always include size attributes for images
    const strategies = {
      images: 'Add width and height attributes to all images',
      ads: 'Reserve space for dynamic content',
      fonts: 'Use font-display: swap with proper fallbacks',
      embeds: 'Reserve space for iframes and embeds'
    };

    return strategies;
  },

  // Fix LCP (Largest Contentful Paint)
  fixLCP: () => {
    const strategies = {
      priority: [
        'Preload critical resources (hero images, web fonts)',
        'Use next/image with priority prop for above-fold images',
        'Remove render-blocking resources',
        'Implement lazy loading for below-fold images'
      ],
      optimization: [
        'Serve images in WebP format with fallbacks',
        'Implement responsive images with srcset',
        'Use CDN for static assets',
        'Minify and compress CSS/JS'
      ]
    };

    return strategies;
  },

  // Fix FCP (First Contentful Paint)
  fixFCP: () => {
    return {
      server: [
        'Enable HTTP/2 or HTTP/3',
        'Use server-side rendering for critical pages',
        'Implement caching headers',
        'Reduce server response time'
      ],
      client: [
        'Minimize critical CSS',
        'Defer non-critical JavaScript',
        'Use font-display: swap',
        'Optimize critical render path'
      ]
    };
  },

  // Generate optimized meta tags
  generateMetaTags: (pageInfo: {
    title: string;
    description: string;
    image?: string;
    url: string;
  }) => {
    const { title, description, image, url } = pageInfo;
    
    return {
      // Basic
      title: `${title} | Your Site`,
      description,
      
      // Open Graph
      'og:title': title,
      'og:description': description,
      'og:image': image || '/default-og-image.jpg',
      'og:url': url,
      'og:type': 'website',
      
      // Twitter
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || '/default-twitter-image.jpg',
      
      // Additional
      'viewport': 'width=device-width, initial-scale=1, maximum-scale=5',
      'theme-color': '#000000'
    };
  },

  // Generate preload/prefetch hints
  generateResourceHints: (resources: Array<{
    href: string;
    as: 'image' | 'style' | 'script' | 'font';
    type?: string;
    crossorigin?: boolean;
  }>) => {
    return resources.map(resource => ({
      rel: 'preload',
      href: resource.href,
      as: resource.as,
      type: resource.type,
      crossOrigin: resource.crossorigin ? 'anonymous' : undefined
    }));
  }
};

// Component for optimized images
export const OptimizedImage = {
  strategies: {
    hero: {
      priority: true,
      loading: 'eager',
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      format: 'webp',
      quality: 85
    },
    content: {
      priority: false,
      loading: 'lazy',
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      format: 'webp',
      quality: 75
    },
    thumbnail: {
      priority: false,
      loading: 'lazy',
      sizes: '150px',
      format: 'webp',
      quality: 60
    }
  }
};