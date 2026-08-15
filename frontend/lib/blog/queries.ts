import { db } from '@/lib/db';
import { blogPosts, blogCategories, users, comments, postReactions } from '@/lib/db/schema';
import { eq, and, desc, sql, count } from 'drizzle-orm';

export async function getPublishedPosts(lang: string = 'en', limit: number = 10, offset: number = 0) {
  return await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    excerpt: blogPosts.excerpt,
    featuredImage: blogPosts.featuredImage,
    categoryName: blogCategories.name,
    categorySlug: blogCategories.slug,
    authorName: users.name,
    authorAvatar: users.avatar,
    viewCount: blogPosts.viewCount,
    publishedAt: blogPosts.publishedAt,
  }).from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(and(
      eq(blogPosts.status, 'published'),
      eq(blogPosts.visibility, 'public'),
      eq(blogPosts.lang, lang)
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getPostBySlug(slug: string) {
  const result = await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    content: blogPosts.content,
    excerpt: blogPosts.excerpt,
    featuredImage: blogPosts.featuredImage,
    relatedTools: blogPosts.relatedTools,
    categoryId: blogPosts.categoryId,
    categoryName: blogCategories.name,
    authorName: users.name,
    authorAvatar: users.avatar,
    authorBio: users.bio,
    seoTitle: blogPosts.seoTitle,
    seoDescription: blogPosts.seoDescription,
    seoKeywords: blogPosts.seoKeywords,
    viewCount: blogPosts.viewCount,
    publishedAt: blogPosts.publishedAt,
  }).from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
    .limit(1);

  return result[0] || null;
}

export async function getRelatedPosts(postId: number, categoryId: number | null, limit: number = 3) {
  return await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    excerpt: blogPosts.excerpt,
    featuredImage: blogPosts.featuredImage,
    publishedAt: blogPosts.publishedAt,
  }).from(blogPosts)
    .where(and(
      eq(blogPosts.status, 'published'),
      categoryId ? eq(blogPosts.categoryId, categoryId) : undefined,
      sql`${blogPosts.id} != ${postId}`
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

export async function getPostsByCategory(categorySlug: string, lang: string = 'en', limit: number = 10) {
  return await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    excerpt: blogPosts.excerpt,
    featuredImage: blogPosts.featuredImage,
    authorName: users.name,
    viewCount: blogPosts.viewCount,
    publishedAt: blogPosts.publishedAt,
  }).from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(and(
      eq(blogPosts.status, 'published'),
      eq(blogPosts.lang, lang),
      eq(blogCategories.slug, categorySlug)
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

export async function incrementPostView(slug: string) {
  await db.update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.slug, slug));
}

export async function getPostReactionCounts(postId: number) {
  const counts = await db.select({
    reaction: postReactions.reaction,
    count: sql<number>`count(*)`.mapWith(Number),
  }).from(postReactions)
    .where(eq(postReactions.postId, postId))
    .groupBy(postReactions.reaction);

  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => { countMap[c.reaction] = c.count; });
  return countMap;
}
