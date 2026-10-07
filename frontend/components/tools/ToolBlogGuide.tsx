'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
}

export default function ToolBlogGuide({ toolSlug, lang }: { toolSlug: string; lang: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categories = ['calculators', 'code-tools', 'design-tools', 'image-tools', 'pdf-tools', 'security-tools', 'text-tools'];
    if (!toolSlug || categories.includes(toolSlug)) {
      setLoading(false);
      return;
    }

    fetch(`/api/blog?tool=${encodeURIComponent(toolSlug)}&lang=${lang}&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [toolSlug, lang]);

  function extractSections(html: string): { title: string; body: string }[] {
    const sections: { title: string; body: string }[] = [];
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/gi;
    let match;

    while ((match = h2Regex.exec(html)) !== null) {
      const title = match[1].replace(/<[^>]*>/g, '').trim();
      let body = match[2].trim();

      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('faq') || lowerTitle.includes('question') ||
          lowerTitle.includes('سوال') || lowerTitle.includes('प्रश्न') ||
          lowerTitle.includes('أسئلة') || lowerTitle.includes('related tool') ||
          lowerTitle.includes('مزید') || lowerTitle.includes('संबंधित')) {
        continue;
      }

      body = body.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<strong>$1</strong><br/>');

      const textOnly = body.replace(/<[^>]*>/g, ' ');
      const words = textOnly.split(/\s+/).filter(Boolean);
      if (words.length > 300) {
        body = words.slice(0, 300).join(' ') + '...';
      }

      if (body.length > 50) {
        sections.push({ title, body });
      }
    }

    return sections.slice(0, 5);
  }

  if (loading || !post) return null;

  const sections = extractSections(post.content);
  if (sections.length === 0) return null;

  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary, #0f172a)' }}>
          <BookOpen size={22} style={{ color: 'var(--primary, #3b82f6)' }} />
          Complete Guide
        </h2>
        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="text-sm font-medium flex items-center gap-1 hover:underline shrink-0"
          style={{ color: 'var(--primary, #3b82f6)' }}
        >
          Read Full Guide <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border"
            style={{
              borderColor: 'var(--border, #e2e8f0)',
              backgroundColor: 'var(--surface, #ffffff)',
            }}
          >
            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary, #0f172a)' }}>
              {section.title}
            </h3>
            <div
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary, #64748b)' }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.body) }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: 'var(--primary, #3b82f6)' }}
        >
          <BookOpen size={16} />
          Read Full Guide <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}