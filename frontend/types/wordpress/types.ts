// types/wordpress/types.ts - Actual module with exports
export interface WPPost {
  id: number;
  title: string;
  content: string;
  date?: string;
  slug?: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

// ... other types