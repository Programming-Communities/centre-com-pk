// types/wordpress/graphql.types.ts
export interface WordPressPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  author: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
      description?: string;
    };
  };
  categories: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  tags: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  commentCount: number;
  seo?: {
    title: string;
    metaDesc: string;
    opengraphTitle?: string;
    opengraphDescription?: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
  comments?: {
    nodes: WordPressComment[];
  };
}

export interface WordPressComment {
  id: string;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
  replies?: {
    nodes: WordPressComment[];
  };
}

export interface WordPressCategory {
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

export interface WordPressUser {
  id: string;
  name: string;
  email?: string;
  description?: string;
  avatar?: {
    url: string;
  };
  roles?: {
    nodes: Array<{
      name: string;
    }>;
  };
}