import { pgTable, serial, text, integer, timestamp, boolean, json, real, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ============================================
// EXISTING USERS TABLE (Extended)
// ============================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  username: text('username').unique(),
  role: text('role', { enum: ['user', 'admin', 'moderator'] }).default('user').notNull(),
  status: text('status', { enum: ['active', 'suspended', 'pending'] }).default('pending').notNull(),
  emailVerified: boolean('email_verified').default(false),
  avatar: text('avatar'),
  bio: text('bio'),
  website: text('website'),
  plan: text('plan', { enum: ['free', 'pro', 'premium', 'lifetime'] }).default('free').notNull(),
  tokensUsed: integer('tokens_used').default(0),
  tokensLimit: integer('tokens_limit').default(20),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// VERIFICATION TOKENS
// ============================================
export const verificationTokens = pgTable('verification_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  type: text('type', { enum: ['email_verify', 'password_reset'] }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// SUBSCRIPTIONS
// ============================================
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  plan: text('plan', { enum: ['free', 'pro', 'premium', 'lifetime'] }).notNull(),
  status: text('status', { enum: ['active', 'cancelled', 'expired'] }).default('active'),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  amount: real('amount').default(0),
  currency: text('currency').default('USD'),
  paymentId: text('payment_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// BLOG CATEGORIES
// ============================================
export const blogCategories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  lang: text('lang').default('en').notNull(),
  icon: text('icon'),
  parentId: integer('parent_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// BLOG POSTS
// ============================================
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  categoryId: integer('category_id').references(() => blogCategories.id),
  authorId: integer('author_id').references(() => users.id).notNull(),
  relatedTools: text('related_tools'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  visibility: text('visibility', { enum: ['public', 'private'] }).default('public').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  lang: text('lang').default('en').notNull(),
  viewCount: integer('view_count').default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('blog_posts_category_idx').on(table.categoryId),
  authorIdx: index('blog_posts_author_idx').on(table.authorId),
  statusIdx: index('blog_posts_status_idx').on(table.status),
  slugIdx: index('blog_posts_slug_idx').on(table.slug),
}));

// ============================================
// TOOL CONTENT (800-1000 words per tool)
// ============================================
export const toolContent = pgTable('tool_content', {
  id: serial('id').primaryKey(),
  toolSlug: text('tool_slug').notNull(),
  category: text('category').notNull(),
  lang: text('lang').default('en').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  introduction: text('introduction'),
  howToUse: text('how_to_use'),
  features: text('features'),
  useCases: text('use_cases'),
  faqs: text('faqs'),
  comparisonText: text('comparison_text'),
  seoKeywords: text('seo_keywords'),
  relatedBlogIds: text('related_blog_ids'),
  status: text('status', { enum: ['draft', 'published'] }).default('draft').notNull(),
  authorId: integer('author_id').references(() => users.id),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  toolSlugIdx: uniqueIndex('tool_content_slug_lang_idx').on(table.toolSlug, table.lang),
}));

// ============================================
// POST REACTIONS (Likes/Dislikes/Emojis)
// ============================================
export const postReactions = pgTable('post_reactions', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: text('session_id'),
  reaction: text('reaction', { enum: ['like', 'dislike', 'love', 'wow', 'funny', 'sad', 'angry'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueReaction: uniqueIndex('unique_reaction_idx').on(table.postId, table.userId, table.sessionId, table.reaction),
}));

// ============================================
// COMMENTS
// ============================================
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  parentId: integer('parent_id'),
  content: text('content').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'spam', 'trash'] }).default('approved').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  postIdx: index('comments_post_idx').on(table.postId),
  userIdx: index('comments_user_idx').on(table.userId),
}));

// ============================================
// TOKEN USAGE
// ============================================
export const tokenUsage = pgTable('token_usage', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  ip: text('ip'),
  tokensUsed: integer('tokens_used').default(0),
  date: text('date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// BDAY CARDS
// ============================================
export const bdayCards = pgTable('bday_cards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  birthDate: text('birth_date').notNull(),
  theme: text('theme').default('default'),
  message: text('message'),
  emoji: text('emoji'),
  shareToken: text('share_token').unique(),
  views: integer('views').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});



// ============================================
// 🆕 USER DOCUMENTS (Quill.js Dashboard)
// ============================================
export const userDocuments = pgTable('user_documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull().default('Untitled'),
  content: text('content'),
  contentType: text('content_type').default('quill-delta'),
  plainText: text('plain_text'),
  language: text('language').default('en'),
  folder: text('folder').default('root'),
  tags: text('tags'),
  wordCount: integer('word_count').default(0),
  charCount: integer('char_count').default(0),
  viewCount: integer('view_count').default(0),
  isPublic: boolean('is_public').default(false),
  shareToken: text('share_token').unique(),
  isStarred: boolean('is_starred').default(false),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_docs_user_idx').on(table.userId),
  folderIdx: index('user_docs_folder_idx').on(table.folder),
  shareTokenIdx: index('user_docs_share_idx').on(table.shareToken),
  isDeletedIdx: index('user_docs_deleted_idx').on(table.isDeleted),
}));

// ============================================
// 🆕 DOCUMENT VERSIONS (Auto-save history)
// ============================================
export const documentVersions = pgTable('document_versions', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => userDocuments.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  plainText: text('plain_text'),
  version: integer('version').notNull().default(1),
  comment: text('comment'),
  fileSize: integer('file_size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  docVersionIdx: index('doc_versions_doc_idx').on(table.documentId),
}));

// ============================================
// 🆕 DOCUMENT SHARES (Shared users tracking)
// ============================================
export const documentShares = pgTable('document_shares', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => userDocuments.id, { onDelete: 'cascade' }).notNull(),
  sharedBy: integer('shared_by').references(() => users.id).notNull(),
  sharedWith: integer('shared_with').references(() => users.id),
  shareToken: text('share_token').unique(),
  permission: text('permission', { enum: ['view', 'comment', 'edit'] }).default('view'),
  isLink: boolean('is_link').default(false),
  linkExpires: timestamp('link_expires'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  docShareIdx: index('doc_shares_doc_idx').on(table.documentId),
}));