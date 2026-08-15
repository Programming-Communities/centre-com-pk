import Link from 'next/link';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    categoryName?: string | null;
    authorName?: string | null;
    authorAvatar?: string | null;
    viewCount?: number | null;
    publishedAt?: string | null;
  };
  lang: string;
}

export default function BlogCard({ post, lang }: BlogCardProps) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="group bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
    >
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {post.categoryName && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-white backdrop-blur-sm">
              {post.categoryName}
            </span>
          )}
        </div>
      )}
      
      <div className="p-5">
        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors text-lg mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        {post.excerpt && (
          <p className="text-text-secondary text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            {post.authorName && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.authorName}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          
          {post.viewCount !== null && post.viewCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Eye className="w-3 h-3" />
              {post.viewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
