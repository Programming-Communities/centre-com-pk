import BlogPageClient from './BlogPageClient';

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <BlogPageClient lang={lang} />;
}
