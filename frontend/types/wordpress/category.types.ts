// types/wordpress/category.types.ts
export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  seo?: {
    title: string;
    metaDesc: string;
  };
  posts?: {
    pageInfo: {
      total: number;
    };
  };
}