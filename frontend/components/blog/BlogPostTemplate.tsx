'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import BlogFAQ from './BlogFAQ';
import BlogComparison from './BlogComparison';
import BlogVideo from './BlogVideo';
import Link from 'next/link';
import { Calendar, User, Clock, Tag, Eye, Heart, Share2, Bookmark, ThumbsUp, ArrowLeft } from 'lucide-react';

interface BlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  lang?: string;
  views?: number;
  likes?: number;
  created_at?: string;
  author?: string;
  read_time?: string;
  video_id?: string;
  tool_slug?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  related_posts?: any[];
  translations?: any[];
}

export default function BlogPostTemplate({ post, lang }: { post: BlogPostData; lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const isRTL = lang === 'ur' || lang === 'ar';

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>📄 Article Not Found</h1>
          <Link href={`/${lang}/blog`} className="text-sm font-medium" style={{ color: 'var(--primary)' }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  let contentData: any = {};
  try {
    contentData = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
  } catch {
    contentData = { introduction: post.content };
  }

  const bg = themeColors?.background || '#f8fafc';
  const surface = themeColors?.surface || '#ffffff';
  const textPrimary = themeColors?.text?.primary || '#0f172a';
  const textSecondary = themeColors?.text?.secondary || '#64748b';
  const border = themeColors?.border || '#e2e8f0';
  const primary = themeColors?.primary || '#3b82f6';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}15, ${primary}05)` }}>
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-sm mb-4 hover:underline" style={{ color: textSecondary }}>
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          {/* Category Badge */}
          {post.category && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: primary + '20', color: primary }}>
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight" style={{ color: textPrimary }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg mb-6 max-w-3xl" style={{ color: textSecondary }}>{post.excerpt}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: textSecondary }}>
            {post.author && <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>}
            {post.created_at && <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>}
            {post.read_time && <span className="flex items-center gap-1"><Clock size={14} /> {post.read_time}</span>}
            {post.views !== undefined && <span className="flex items-center gap-1"><Eye size={14} /> {post.views} views</span>}
            {post.likes !== undefined && <span className="flex items-center gap-1"><Heart size={14} /> {post.likes} likes</span>}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            
            {/* 1. Introduction */}
            {contentData.introduction && (
              <section className="mb-8">
                <div className="prose max-w-none text-lg leading-relaxed" style={{ color: textSecondary }}>
                  {contentData.introduction}
                </div>
              </section>
            )}

            {/* 2. Video Tutorial */}
            {post.video_id && (
              <BlogVideo videoId={post.video_id} title={post.title} />
            )}

            {/* 3. What Is */}
            {contentData.whatIs && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>📖 What is {post.title}?</h2>
                <p className="leading-relaxed" style={{ color: textSecondary }}>{contentData.whatIs}</p>
              </section>
            )}

            {/* 4. Features Grid */}
            {contentData.features?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>⭐ Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentData.features.map((f: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl border" style={{ borderColor: border, backgroundColor: surface }}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{f.icon}</span>
                        <div>
                          <h3 className="font-bold mb-1" style={{ color: textPrimary }}>{f.title}</h3>
                          <p className="text-sm" style={{ color: textSecondary }}>{f.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. How to Use Steps */}
            {contentData.howToUse?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>📋 How to Use</h2>
                <div className="space-y-4">
                  {contentData.howToUse.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: border, backgroundColor: surface }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: primary }}>{step.step}</div>
                      <div>
                        <h3 className="font-bold mb-1" style={{ color: textPrimary }}>{step.title}</h3>
                        <p className="text-sm" style={{ color: textSecondary }}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Use Cases */}
            {contentData.useCases?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>🎯 Real-World Use Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentData.useCases.map((uc: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border" style={{ borderColor: border, backgroundColor: surface }}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{uc.icon}</span>
                        <div>
                          <h3 className="font-bold" style={{ color: textPrimary }}>{uc.title}</h3>
                          <p className="text-sm" style={{ color: textSecondary }}>{uc.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Pro Tips */}
            {contentData.proTips?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: textPrimary }}>💡 Pro Tips</h2>
                <div className="space-y-2">
                  {contentData.proTips.map((tip: string, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#f59e0b10', borderLeft: '3px solid #f59e0b' }}>
                      <p className="text-sm" style={{ color: textPrimary }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8. FAQ */}
            {contentData.faqs?.length > 0 && <BlogFAQ faqs={contentData.faqs} />}

            {/* 9. Privacy Note */}
            {contentData.privacyNote && (
              <section className="mb-8 p-5 rounded-xl border" style={{ borderColor: '#10b98130', backgroundColor: '#10b98108' }}>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: '#10b981' }}>🔒 Privacy Note</h2>
                <p className="text-sm" style={{ color: textSecondary }}>{contentData.privacyNote}</p>
              </section>
            )}

            {/* Tool CTA */}
            {post.tool_slug && (
              <div className="mt-8 p-6 rounded-xl text-center" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
                <h2 className="text-xl font-bold mb-2 text-white">🚀 Ready to Try?</h2>
                <p className="text-white/80 mb-4 text-sm">Use our free tool now — no registration required!</p>
                <Link href={`/${lang}/tools/${post.category || 'calculators'}/${post.tool_slug}`} 
                  className="inline-block px-6 py-3 rounded-xl font-bold bg-white hover:bg-gray-100 transition"
                  style={{ color: primary }}>
                  Use {post.title} Now →
                </Link>
              </div>
            )}

            {/* Related Posts */}
            {post.related_posts?.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>📚 Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.related_posts.map((rp: any) => (
                    <Link key={rp.id} href={`/${lang}/blog/${rp.slug}`} className="p-4 rounded-xl border block hover:shadow-lg transition" style={{ borderColor: border, backgroundColor: surface }}>
                      <h3 className="font-bold mb-1" style={{ color: textPrimary }}>{rp.title}</h3>
                      <p className="text-xs" style={{ color: textSecondary }}>{rp.category} • {rp.created_at ? new Date(rp.created_at).toLocaleDateString() : ''}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Share */}
              <div className="p-4 rounded-xl border" style={{ borderColor: border, backgroundColor: surface }}>
                <h3 className="font-bold mb-3 text-sm" style={{ color: textPrimary }}>Share</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border" style={{ borderColor: border }} title="Copy Link">🔗</button>
                  <button className="p-2 rounded-lg border" style={{ borderColor: border }} title="Twitter">🐦</button>
                  <button className="p-2 rounded-lg border" style={{ borderColor: border }} title="Facebook">📘</button>
                  <button className="p-2 rounded-lg border" style={{ borderColor: border }} title="WhatsApp">💬</button>
                </div>
              </div>

              {/* Quick Nav */}
              <div className="p-4 rounded-xl border" style={{ borderColor: border, backgroundColor: surface }}>
                <h3 className="font-bold mb-3 text-sm" style={{ color: textPrimary }}>On This Page</h3>
                <ul className="space-y-2 text-xs">
                  {contentData.features && <li><a href="#features" style={{ color: primary }}>⭐ Features</a></li>}
                  {contentData.howToUse && <li><a href="#how-to" style={{ color: primary }}>📋 How to Use</a></li>}
                  {contentData.useCases && <li><a href="#use-cases" style={{ color: primary }}>🎯 Use Cases</a></li>}
                  {contentData.proTips && <li><a href="#tips" style={{ color: primary }}>💡 Pro Tips</a></li>}
                  {contentData.faqs && <li><a href="#faq" style={{ color: primary }}>❓ FAQ</a></li>}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
