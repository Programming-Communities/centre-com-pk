// lib/data/categoryConfig.ts
export interface CategoryConfig {
  slug: string;
  path: string;
  toolCount: number;
  categoryType: string;
  icon?: string;
  color?: string;
}

export const categoryConfig: CategoryConfig[] = [
  { slug: 'calculators', path: '/tools/calculators', toolCount: 25, categoryType: 'calculators' },
  { slug: 'code-tools', path: '/tools/code-tools', toolCount: 15, categoryType: 'code' },
  { slug: 'design-tools', path: '/tools/design-tools', toolCount: 10, categoryType: 'design' },
  { slug: 'image-tools', path: '/tools/image-tools', toolCount: 12, categoryType: 'image' },
  { slug: 'pdf-tools', path: '/tools/pdf-tools', toolCount: 8, categoryType: 'pdf' },
  { slug: 'security-tools', path: '/tools/security-tools', toolCount: 10, categoryType: 'security' },
  { slug: 'text-tools', path: '/tools/text-tools', toolCount: 12, categoryType: 'text' },
  { slug: 'educational', path: '/tools', toolCount: 18, categoryType: 'educational' },
];

export function getCategoryConfig() {
  return categoryConfig;
}

export function getCategoryBySlug(slug: string) {
  return categoryConfig.find(cat => cat.slug === slug);
}