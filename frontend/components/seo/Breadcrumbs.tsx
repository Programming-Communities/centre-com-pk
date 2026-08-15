// components/seo/Breadcrumbs.tsx — FIXED v2.0
// ✅ FIXED: Removed duplicate inline JSON-LD schema
// Schema is now handled ONLY by lib/seo/generateBreadcrumbs.ts

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronRight, Home } from 'lucide-react';

interface LocalBreadcrumbItem {
  name: string;
  url: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items?: LocalBreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  separator?: React.ReactNode;
}

export default function Breadcrumbs({
  items,
  showHome = true,
  className = '',
  separator = <ChevronRight className="w-4 h-4 mx-2 text-text-secondary shrink-0" />,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { t } = useTranslation({ namespace: 'common' });
  
  const breadcrumbItems = items || generateBreadcrumbsFromPathname(pathname, lang, t, showHome);
  
  if (breadcrumbItems.length === 0) {
    return null;
  }
  
  return (
    <nav className={`breadcrumbs ${className}`} aria-label={t('aria.breadcrumb', 'Breadcrumb')}>
      <ol className="flex flex-wrap items-center text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.url} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={item.url}
                    className="text-text-secondary hover:text-primary transition-colors duration-200"
                    aria-label={item.name}
                  >
                    {item.icon === 'home' ? (
                      <Home className="w-4 h-4" />
                    ) : (
                      item.name
                    )}
                  </Link>
                  {separator}
                </>
              ) : (
                <span 
                  className="text-primary font-medium truncate max-w-xs md:max-w-md lg:max-w-lg"
                  aria-current="page"
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* ✅ FIXED: Removed inline JSON-LD — now handled by generateBreadcrumbs.ts */}
    </nav>
  );
}

function generateBreadcrumbsFromPathname(
  pathname: string, 
  lang: string, 
  t: (key: string, fallback?: string) => string,
  showHome: boolean
): LocalBreadcrumbItem[] {
  const items: LocalBreadcrumbItem[] = [];
  
  if (showHome) {
    items.push({
      name: t('home', 'Home'),
      url: `/${lang}`,
      icon: 'home',
    });
  }
  
  const segments = pathname.split('/').filter(segment => segment.length > 0 && segment !== lang);
  
  let accumulatedPath = `/${lang}`;
  segments.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    
    let name = segment;
    
    if (segment === 'tools') {
      name = t('tools', 'Tools');
    } else if (segment === 'calculators') {
      name = t('calculators', 'Calculators');
    } else if (segment === 'code-tools') {
      name = t('code_tools', 'Code Tools');
    } else if (segment === 'image-tools') {
      name = t('image_tools', 'Image Tools');
    } else if (segment === 'pdf-tools') {
      name = t('pdf_tools', 'PDF Tools');
    } else if (segment === 'security-tools') {
      name = t('security_tools', 'Security Tools');
    } else if (segment === 'text-tools') {
      name = t('text_tools', 'Text Tools');
    } else if (segment === 'design-tools') {
      name = t('design_tools', 'Design Tools');
    } else {
      name = segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    items.push({ name, url: accumulatedPath });
  });
  
  return items;
}