// lib/data/categories.ts
export interface Category {
  slug: string;
  name: string;
  description?: string;
  toolCount: number;
  lastModified?: Date;
}

export async function getAllCategories(): Promise<Category[]> {
  const categories: Category[] = [
    { slug: 'calculators', name: 'Calculators', description: 'Math, finance, and conversion calculators', toolCount: 25 },
    { slug: 'code-tools', name: 'Code Tools', description: 'Programming, development and IT utilities', toolCount: 15 },
    { slug: 'design-tools', name: 'Design Tools', description: 'Graphics, color, and design utilities', toolCount: 10 },
    { slug: 'security-tools', name: 'Security Tools', description: 'Privacy, encryption and security utilities', toolCount: 10 },
    { slug: 'image-tools', name: 'Image Tools', description: 'Image editing, conversion and optimization tools', toolCount: 12 },
    { slug: 'pdf-tools', name: 'PDF Tools', description: 'PDF manipulation, conversion and optimization', toolCount: 8 },
    { slug: 'text-tools', name: 'Text Tools', description: 'Text processing, formatting and analysis tools', toolCount: 12 },
    { slug: 'educational', name: 'Educational Tools', description: 'Tools for students, teachers, and researchers', toolCount: 18 },
  ];
  
  // Add realistic last modified dates
  const now = new Date();
  return categories.map(cat => ({
    ...cat,
    lastModified: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(cat => cat.slug === slug) || null;
}