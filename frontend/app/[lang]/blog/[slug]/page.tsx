// app/[lang]/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { renderContent } from '@/lib/content-renderer';
import type { Metadata } from 'next';

const BlogPostClient = dynamic(() => import('./BlogPostClient'));


const ALL_LANGS = ['en', 'ur', 'hi', 'ar'];
const BASE_URL = 'https://www.centre.com.pk';

// ✅ ADD generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const currentUrl = `${BASE_URL}/${lang}/blog/${slug}`;
  const alternates: Record<string, string> = {};
  ALL_LANGS.forEach(l => { alternates[l] = `${BASE_URL}/${l}/blog/${slug}`; });
  alternates['x-default'] = `${BASE_URL}/blog/${slug}`;

  // Fetch post data for title/description (optional, but good for SEO)
  let title = 'Blog Post';
  let description = '';
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const post = db.prepare("SELECT title, excerpt, seo_title, seo_description FROM blog_posts WHERE slug = ? AND lang = ? AND status = 'published'").get(slug, lang) as any;
    if (post) {
      title = post.seo_title || post.title;
      description = (post.seo_description || post.excerpt || '').substring(0, 160);
    }
  } catch {}

  return {
    title: `${title} | Centre.com.pk`,
    description,
    alternates: {
      canonical: currentUrl,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  let db: any;
  let post: any = null;
  try {
    db = (await import('@/lib/db/local-db')).getLocalDB();

    post = db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND lang = ? AND status = 'published'").get(slug, lang) as any;

    if (!post) {
      post = db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'").get(slug) as any;
      if (post && post.translations) {
        try {
          const translations = JSON.parse(post.translations);
          const t = translations[lang] || translations['en'] || {};
          if (t.title) post.title = t.title;
          if (t.slug) post.slug = t.slug;
          if (t.content) post.content = t.content;
          if (t.excerpt) post.excerpt = t.excerpt;
          if (t.seo_title) post.seo_title = t.seo_title;
          if (t.seo_description) post.seo_description = t.seo_description;
        } catch {}
      }
    }
  } catch {
    notFound();
  }

  if (!post) notFound();
  
  try {
    db.prepare("UPDATE blog_posts SET view_count = view_count + 1, views = views + 1 WHERE id = ?").run(post.id);
  } catch {}
  
  let htmlContent = post.content || '';
  try { const p = JSON.parse(post.content); if (Array.isArray(p) || typeof p === 'object') htmlContent = renderContent(post.content, 'auto'); }
  catch { if (!/<[a-z][\s\S]*>/i.test(post.content)) htmlContent = renderContent(post.content, 'markdown'); }
  
  let relatedPosts: any[] = [];
  if (post.tool_slug) {
    try {
      relatedPosts = db.prepare("SELECT id, title, slug, lang, excerpt, category, created_at, views FROM blog_posts WHERE tool_slug = ? AND id != ? AND status = 'published' ORDER BY created_at DESC LIMIT 4").all(post.tool_slug, post.id) as any[];
    } catch {}
  }
  
  let availableLangs: string[] = [post.lang || 'en'];
  try {
    const allLangRows = db.prepare("SELECT lang FROM blog_posts WHERE slug = ? AND status = 'published'").all(slug) as any[];
    availableLangs = allLangRows.length > 0 ? allLangRows.map((r: any) => r.lang) : [post.lang || 'en'];
  } catch {}
  
  let likeCount = 0;
  let reactionCounts: any[] = [];
  try {
    likeCount = (db.prepare("SELECT COUNT(*) as count FROM blog_likes WHERE post_slug = ?").get(post.slug) as any)?.count || 0;
    reactionCounts = db.prepare("SELECT reaction_type, COUNT(*) as count FROM post_reactions WHERE post_slug = ? GROUP BY reaction_type").all(post.slug) as any[];
  } catch {}
  let commentCount = 0, comments: any[] = [];
  try {
    commentCount = (db.prepare("SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND status = 'approved'").get(post.id) as any)?.count || 0;
    comments = db.prepare("SELECT c.*, u.name as user_name FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? AND c.status = 'approved' ORDER BY c.created_at DESC LIMIT 50").all(post.id) as any[];
  } catch {}
  
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  let sessionUser: any = null;
  if (sessionCookie) { try { sessionUser = JSON.parse(sessionCookie.value); } catch {} }
  
  const reactionsMap: Record<string, number> = {};
  (reactionCounts || []).forEach((r: any) => { reactionsMap[r.reaction_type] = r.count; });
  
  const headings: { id: string; text: string; level: number }[] = [];
  const cs = post.content || '';
  (cs.match(/<h2[^>]*>.*?<\/h2>/g) || []).forEach((h: string, i: number) => { headings.push({ id: `heading-${i}`, text: h.replace(/<[^>]*>/g, ''), level: 2 }); });
  (cs.match(/<h3[^>]*>.*?<\/h3>/g) || []).forEach((h: string, i: number) => { headings.push({ id: `heading-h3-${i}`, text: h.replace(/<[^>]*>/g, ''), level: 3 }); });
  
  const featuredImage = post.featured_image || post.image_url || '';
  const authorName = post.author || 'Centre.com.pk';
  const displayViews = (post.view_count || post.views || 0) + 1;
  const readTime = Math.max(1, Math.round((post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200));
  
  return (
    <>
      {/* ✅ No manual canonical/hreflang – handled by generateMetadata */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        '@id': `${BASE_URL}/${lang}/blog/${slug}#article`,
        headline: post.seo_title || post.title,
        description: (post.seo_description || post.excerpt || '').substring(0, 160),
        author: { '@type': 'Organization', name: authorName, url: BASE_URL },
        publisher: { '@type': 'Organization', name: 'Centre.com.pk', logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.svg` } },
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.created_at,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${lang}/blog/${slug}` },
        inLanguage: lang,
      }) }} />
      
      <BlogPostClient
        post={{...post, featured_image: featuredImage}} lang={lang} htmlContent={htmlContent} relatedPosts={relatedPosts}
        translations={availableLangs.map((l: string) => ({ lang: l, slug }))} headings={headings}
        likeCount={likeCount} reactionCounts={reactionsMap} commentCount={commentCount}
        comments={comments} sessionUser={sessionUser} readTime={readTime}
        displayViews={displayViews} authorName={authorName} categoryCount={0}
      />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    return (db.prepare("SELECT slug, lang FROM blog_posts WHERE status = 'published'").all() as any[]).map((p: any) => ({ lang: p.lang || 'en', slug: p.slug }));
  } catch { return []; }
}