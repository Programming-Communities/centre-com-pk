// lib/seo/robotsGenerator.ts
import { SITE_URL } from './constants';

export interface RobotsDirective {
  userAgent: string | '*';
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
  cleanParam?: string[];
}

export interface RobotsConfig {
  host?: string;
  sitemap?: string | string[];
  directives: RobotsDirective[];
  comments?: string[];
}

export function generateRobotsTxt(config?: Partial<RobotsConfig>): string {
  const defaultConfig: RobotsConfig = {
    host: SITE_URL.replace(/https?:\/\//, ''),
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-index.xml`,
    ],
    directives: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/staging/',
          '/dev/',
          '/test/',
          '/wp-admin/',
          '/wp-includes/',
          '/wp-json/',
          '/search/',
          '/?s=',
          '/feed/',
          '/comments/feed/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot-Mobile',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot-Video',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'AdsBot-Google-Mobile',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 2,
      },
      {
        userAgent: 'Slurp',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 3,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Baiduspider',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 5,
      },
      {
        userAgent: 'YandexBot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 2,
      },
      {
        userAgent: 'Applebot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: 2,
      },
      {
        userAgent: 'Twitterbot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'rogerbot',
        disallow: ['/'],
      },
      {
        userAgent: 'MJ12bot',
        disallow: ['/'],
      },
      {
        userAgent: 'AhrefsBot',
        disallow: ['/'],
        crawlDelay: 10,
      },
      {
        userAgent: 'SEMrushBot',
        disallow: ['/'],
        crawlDelay: 10,
      },
      {
        userAgent: 'DotBot',
        disallow: ['/'],
        crawlDelay: 10,
      },
      {
        userAgent: 'MegaIndex',
        disallow: ['/'],
      },
    ],
    comments: [
      `Generated: ${new Date().toISOString()}`,
      'For Centre.com.pk - Free Online Tools',
      'Contact: support@centre.com.pk for robots.txt questions',
    ],
  };

  const finalConfig: RobotsConfig = {
    ...defaultConfig,
    ...config,
    directives: [
      ...defaultConfig.directives,
      ...(config?.directives || []),
    ],
    comments: [
      ...(defaultConfig.comments || []),
      ...(config?.comments || []),
    ],
  };

  let robotsTxt = '';

  // Add comments
  if (finalConfig.comments && finalConfig.comments.length > 0) {
    robotsTxt += finalConfig.comments.map(comment => `# ${comment}`).join('\n') + '\n\n';
  }

  // Add host directive
  if (finalConfig.host) {
    robotsTxt += `Host: ${finalConfig.host}\n\n`;
  }

  // Add directives
  finalConfig.directives.forEach(directive => {
    robotsTxt += `User-agent: ${directive.userAgent}\n`;
    
    if (directive.disallow && directive.disallow.length > 0) {
      directive.disallow.forEach(path => {
        robotsTxt += `Disallow: ${path}\n`;
      });
    }
    
    if (directive.allow && directive.allow.length > 0) {
      directive.allow.forEach(path => {
        robotsTxt += `Allow: ${path}\n`;
      });
    }
    
    if (directive.crawlDelay !== undefined) {
      robotsTxt += `Crawl-delay: ${directive.crawlDelay}\n`;
    }
    
    if (directive.cleanParam && directive.cleanParam.length > 0) {
      directive.cleanParam.forEach(param => {
        robotsTxt += `Clean-param: ${param}\n`;
      });
    }
    
    robotsTxt += '\n';
  });

  // Add sitemap directives
  if (finalConfig.sitemap) {
    const sitemaps = Array.isArray(finalConfig.sitemap) 
      ? finalConfig.sitemap 
      : [finalConfig.sitemap];
    
    sitemaps.forEach(sitemap => {
      robotsTxt += `Sitemap: ${sitemap}\n`;
    });
  }

  // Add important file allowances
  robotsTxt += '\n# Important files that should be accessible\n';
  robotsTxt += 'Allow: /ads.txt\n';
  robotsTxt += 'Allow: /security.txt\n';
  robotsTxt += 'Allow: /humans.txt\n';
  robotsTxt += 'Allow: /.well-known/\n';
  robotsTxt += 'Allow: /favicon.ico\n';
  robotsTxt += 'Allow: /apple-touch-icon.png\n';
  robotsTxt += 'Allow: /android-chrome-192x192.png\n';
  robotsTxt += 'Allow: /android-chrome-512x512.png\n';
  robotsTxt += 'Allow: /favicon-16x16.png\n';
  robotsTxt += 'Allow: /favicon-32x32.png\n';
  robotsTxt += 'Allow: /site.webmanifest\n';

  // Add CSP report URI if exists
  if (process.env.CSP_REPORT_URI) {
    robotsTxt += `Allow: ${process.env.CSP_REPORT_URI}\n`;
  }

  return robotsTxt.trim();
}

export function generateDynamicRobotsTxt(environment: 'production' | 'staging' | 'development' = 'production'): string {
  const baseConfig: Partial<RobotsConfig> = {
    comments: [
      `Environment: ${environment}`,
      `Generated: ${new Date().toISOString()}`,
      'For Centre.com.pk - Free Online Tools',
    ],
  };

  if (environment === 'production') {
    return generateRobotsTxt(baseConfig);
  }

  if (environment === 'staging') {
    return generateRobotsTxt({
      ...baseConfig,
      directives: [
        {
          userAgent: '*',
          disallow: ['/'],
        },
        {
          userAgent: 'Googlebot',
          disallow: ['/'],
        },
        {
          userAgent: 'Bingbot',
          disallow: ['/'],
        },
      ],
      comments: [
        ...(baseConfig.comments || []),
        'STAGING ENVIRONMENT - ALL BOTS DISALLOWED',
        'This prevents search engines from indexing staging sites',
      ],
    });
  }

  // Development environment
  return generateRobotsTxt({
    ...baseConfig,
    directives: [
      {
        userAgent: '*',
        disallow: ['/'],
      },
    ],
    comments: [
      ...(baseConfig.comments || []),
      'DEVELOPMENT ENVIRONMENT - ALL ACCESS DISALLOWED',
      'This is a local development server',
    ],
  });
}

export function validateRobotsTxt(robotsTxt: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lines = robotsTxt.split('\n');
  let hasUserAgent = false;
  let hasSitemap = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const [directive, ...valueParts] = trimmedLine.split(':');
    const value = valueParts.join(':').trim();

    const directiveLower = directive.toLowerCase();
    
    switch (directiveLower) {
      case 'user-agent':
        hasUserAgent = true;
        if (!value || value.trim() === '') {
          errors.push(`Line ${index + 1}: User-agent directive has no value`);
        }
        break;
        
      case 'disallow':
        if (!hasUserAgent) {
          errors.push(`Line ${index + 1}: Disallow directive without preceding User-agent`);
        }
        break;
        
      case 'allow':
        if (!hasUserAgent) {
          errors.push(`Line ${index + 1}: Allow directive without preceding User-agent`);
        }
        break;
        
      case 'crawl-delay':
        if (!hasUserAgent) {
          errors.push(`Line ${index + 1}: Crawl-delay directive without preceding User-agent`);
        }
        if (isNaN(Number(value)) || Number(value) < 0) {
          errors.push(`Line ${index + 1}: Invalid crawl-delay value: ${value}`);
        }
        break;
        
      case 'sitemap':
        hasSitemap = true;
        if (!value || !isValidUrl(value)) {
          errors.push(`Line ${index + 1}: Invalid sitemap URL: ${value}`);
        }
        break;
        
      case 'host':
        if (!value || !isValidHost(value)) {
          warnings.push(`Line ${index + 1}: Host directive may be invalid: ${value}`);
        }
        break;
        
      default:
        warnings.push(`Line ${index + 1}: Unknown directive: ${directive}`);
    }
  });

  // Reset for next group
  hasUserAgent = false;

  if (!hasSitemap) {
    warnings.push('No sitemap directive found. Consider adding Sitemap directives.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidHost(host: string): boolean {
  // Simple host validation
  const hostRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return hostRegex.test(host);
}

export function parseRobotsTxt(robotsTxt: string): RobotsConfig {
  const lines = robotsTxt.split('\n');
  const config: RobotsConfig = {
    directives: [],
    comments: [],
  };

  let currentDirective: RobotsDirective | null = null;
  const currentComments: string[] = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      return;
    }

    if (trimmedLine.startsWith('#')) {
      currentComments.push(trimmedLine.substring(1).trim());
      return;
    }

    const [directive, ...valueParts] = trimmedLine.split(':');
    const value = valueParts.join(':').trim();

    const directiveLower = directive.toLowerCase();
    
    switch (directiveLower) {
      case 'host':
        config.host = value;
        break;
        
      case 'sitemap':
        if (!config.sitemap) {
          config.sitemap = [];
        }
        if (Array.isArray(config.sitemap)) {
          config.sitemap.push(value);
        }
        break;
        
      case 'user-agent':
        // Save previous directive if exists
        if (currentDirective) {
          config.directives.push(currentDirective);
        }
        
        currentDirective = {
          userAgent: value,
          allow: [],
          disallow: [],
        };
        break;
        
      case 'disallow':
        if (currentDirective) {
          if (!currentDirective.disallow) {
            currentDirective.disallow = [];
          }
          currentDirective.disallow.push(value);
        }
        break;
        
      case 'allow':
        if (currentDirective) {
          if (!currentDirective.allow) {
            currentDirective.allow = [];
          }
          currentDirective.allow.push(value);
        }
        break;
        
      case 'crawl-delay':
        if (currentDirective) {
          currentDirective.crawlDelay = Number(value);
        }
        break;
        
      case 'clean-param':
        if (currentDirective) {
          if (!currentDirective.cleanParam) {
            currentDirective.cleanParam = [];
          }
          currentDirective.cleanParam.push(value);
        }
        break;
    }
  });

  // Add the last directive
  if (currentDirective) {
    config.directives.push(currentDirective);
  }

  // Add accumulated comments
  if (currentComments.length > 0) {
    config.comments = currentComments;
  }

  return config;
}