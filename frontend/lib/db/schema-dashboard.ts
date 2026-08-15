import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const userDocuments = sqliteTable('user_documents', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  contentType: text('content_type').default('quill-delta'),
  plainText: text('plain_text'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  shareToken: text('share_token'),
  language: text('language').default('en'),
  folder: text('folder').default('root'),
  tags: text('tags'),
  wordCount: integer('word_count').default(0),
  viewCount: integer('view_count').default(0),
});

export const documentVersions = sqliteTable('document_versions', {
  id: text('id').primaryKey(),
  documentId: text('document_id').notNull(),
  content: text('content').notNull(),
  version: integer('version').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  comment: text('comment'),
});
