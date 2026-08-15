// types/index.ts
export * from './theme';

// Remove or comment out the WordPress export
// export * from './wordpress';

// Instead, declare global types
declare global {
  namespace WordPress {
    interface Post {
      id: number;
      title: { rendered: string };
      content: { rendered: string };
      excerpt: { rendered: string };
      date: string;
      slug: string;
    }
    
    interface Category {
      id: number;
      name: string;
      slug: string;
    }
  }
}