// types/wordpress/index.d.ts

// Export all WordPress-related types
export interface WPPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  excerpt: string;
  featured_image?: string;
  categories: number[];
  tags: number[];
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

export interface WPComment {
  id: number;
  author_name: string;
  author_avatar?: string;
  date: string;
  content: string;
  post_id: number;
}

// Re-export from your components if they exist
export type { PostType } from '../../components/wordpress/types/post.types';
export type { CategoryType } from '../../components/wordpress/types/post.types';
export type { TagType } from '../../components/wordpress/types/post.types';
export type { AuthorType } from '../../components/wordpress/types/post.types';