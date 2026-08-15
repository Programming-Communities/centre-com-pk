'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface RelatedPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  lang?: string;
  read_time?: number;
}

interface RelatedPostsProps {
  currentSlug?: string;
  currentToolSlug?: string;
  lang?: string;
  limit?: number;
  className?: string;
  title?: string;
}

export default function RelatedPosts({
  currentSlug,
  currentToolSlug,
  lang = 'en',
  limit = 4,
  className = '',
  title = 'Related Blog Posts',
}: RelatedPostsProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));

        if (currentToolSlug) {
          params.set('tool', currentToolSlug);
        }

        if (lang && lang !== 'all') {
          params.set('lang', lang);
        }

        const response = await fetch(`/api/blog/posts?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch related posts');
        }

        const data = await response.json();

        if (data.posts && Array.isArray(data.posts)) {
          const filtered = currentSlug
            ? data.posts.filter((p: any) => p.slug !== currentSlug)
            : data.posts;

          setPosts(filtered.slice(0, limit));
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching related posts:', err);
        setError('Could not load related posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentSlug, currentToolSlug, lang, limit]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-bold mb-4" style={{ color: themeColors.text?.primary }}>{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl p-4"
              style={{ backgroundColor: themeColors.surface || (isDarkMode ? '#1e293b' : '#f8fafc') }}
            >
              <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }} />
              <div className="h-3 rounded w-1/2" style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const surface = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  return (
    <div className={className}>
      <h3 className="text-xl font-bold mb-4" style={{ color: textPrimary }}>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.lang || lang}/blog/${post.slug}`}
            className="group rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            style={{
              backgroundColor: surface,
              borderColor: border,
            }}
          >
            <h4
              className="font-semibold text-sm mb-1 group-hover:underline transition-all line-clamp-2"
              style={{ color: textPrimary }}
            >
              {post.title}
            </h4>
            {post.excerpt && (
              <p className="text-xs line-clamp-2" style={{ color: textSecondary }}>
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: textSecondary }}>
              {post.read_time && <span>⏱️ {post.read_time} min read</span>}
              <span className="text-primary font-medium group-hover:underline">
                Read More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
