'use client';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { BookOpen } from 'lucide-react';

interface RelatedPostsProps {
  posts: any[];
  lang: string;
}

export default function RelatedPosts({ posts, lang }: RelatedPostsProps) {
  const { themeColors, isDarkMode } = useTheme();

  if (!posts || posts.length === 0) return null;

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  return (
    <div style={{ marginTop: '32px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '16px' }}>
        <BookOpen size={18} style={{ display: 'inline', marginRight: '8px', color: primary }} />
        Related Articles
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
        {posts.map((post) => (
          <Link key={post.id} href={`/${lang}/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: surface, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${border}` }}>
              <div style={{ height: '100px', background: post.featured_image ? `url(${post.featured_image}) center/cover` : `linear-gradient(135deg, ${primary}, ${primary}80)` }} />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, lineHeight: 1.3, margin: 0 }}>{post.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
