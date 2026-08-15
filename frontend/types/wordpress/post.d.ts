// types/wordpress/post.d.ts
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  type: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ href: string }>;
    replies: Array<{ href: string }>;
  };
}