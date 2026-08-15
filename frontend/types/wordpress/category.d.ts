// types/wordpress/category.d.ts
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag' | string;
  parent: number;
}