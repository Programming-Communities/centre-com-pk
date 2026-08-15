// types/wordpress/post.types.ts
// Convert WordPress GraphQL types to app types
import { WordPressPost, WordPressComment, WordPressCategory, WordPressUser } from './graphql.types';

export interface PostType {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modifiedDate: string;
  featuredImage?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  author: AuthorType;
  categories: CategoryType[];
  tags: TagType[];
  readingTime: number;
  views: number;
  likes: number;
  comments: number;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  seo?: {
    title: string;
    description: string;
  };
}

export interface TagType {
  id: string;
  name: string;
  slug: string;
}

export interface AuthorType {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface ConvertedCommentType {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  likes: number;
  replies?: ConvertedCommentType[];
}

export const convertWordPressPost = (wpPost: WordPressPost): PostType => {
  return {
    id: wpPost.id,
    title: wpPost.title,
    slug: wpPost.slug,
    excerpt: wpPost.excerpt || '',
    content: wpPost.content || '',
    date: wpPost.date,
    modifiedDate: wpPost.modified,
    featuredImage: wpPost.featuredImage ? {
      url: wpPost.featuredImage.node.sourceUrl,
      alt: wpPost.featuredImage.node.altText || '',
      width: wpPost.featuredImage.node.mediaDetails?.width,
      height: wpPost.featuredImage.node.mediaDetails?.height,
    } : undefined,
    author: {
      id: wpPost.author.node.name,
      name: wpPost.author.node.name,
      avatar: wpPost.author.node.avatar?.url,
      bio: wpPost.author.node.description,
    },
    categories: wpPost.categories.nodes.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    tags: wpPost.tags.nodes.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    readingTime: calculateReadingTime(wpPost.content || ''),
    views: 0,
    likes: 0,
    comments: wpPost.commentCount || 0,
    seo: wpPost.seo ? {
      title: wpPost.seo.title || '',
      description: wpPost.seo.metaDesc || '',
      keywords: [],
    } : undefined,
  };
};

export const convertWordPressComment = (wpComment: WordPressComment, postId: string): ConvertedCommentType => {
  return {
    id: wpComment.id,
    postId,
    author: {
      id: wpComment.author.node.name,
      name: wpComment.author.node.name,
      avatar: wpComment.author.node.avatar?.url,
    },
    content: wpComment.content,
    date: wpComment.date,
    likes: 0,
    replies: wpComment.replies?.nodes.map(reply => 
      convertWordPressComment(reply, postId)
    ),
  };
};

export const convertWordPressCategory = (wpCategory: WordPressCategory): CategoryType => {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description || undefined,
    postCount: wpCategory.count || 0,
    seo: wpCategory.seo ? {
      title: wpCategory.seo.title || '',
      description: wpCategory.seo.metaDesc || '',
    } : undefined,
  };
};

export const convertWordPressUser = (wpUser: WordPressUser) => {
  return {
    id: wpUser.id,
    name: wpUser.name,
    email: wpUser.email,
    avatar: wpUser.avatar?.url,
    bio: wpUser.description,
    role: wpUser.roles?.nodes[0]?.name || 'subscriber',
    joinDate: new Date().toISOString(),
    stats: {
      posts: 0,
      comments: 0,
      likes: 0,
      bookmarks: 0,
    },
  };
};

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};