// Add to lib/db/schema.ts

// ============================================
// BLOG POSTS WITH MULTI-LANGUAGE SUPPORT
// ============================================

// Updated blog_posts table with translations
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  // Parent slug for all languages
  parent_slug: text('parent_slug').notNull(),
  // Translations as JSON
  translations: text('translations').notNull(), // JSON: { en: { title, slug, content, excerpt, seo_title, seo_description }, ur: {...}, ... }
  category: text('category').default('general').notNull(),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  featured_image: text('featured_image'),
  author_id: integer('author_id').references(() => users.id),
  view_count: integer('view_count').default(0),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  parentSlugIdx: index('blog_posts_parent_slug_idx').on(table.parent_slug),
  categoryIdx: index('blog_posts_category_idx').on(table.category),
  statusIdx: index('blog_posts_status_idx').on(table.status),
}));
