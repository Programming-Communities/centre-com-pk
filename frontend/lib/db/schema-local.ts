import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  username: text("username").unique(),
  role: text("role").default("user").notNull(),
  status: text("status").default("pending").notNull(),
  plan: text("plan").default("free").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  tokensUsed: integer("tokens_used").default(0),
  tokensLimit: integer("tokens_limit").default(20),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// User Documents (for Quill.js Dashboard)
export const userDocuments = sqliteTable("user_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull().default("Untitled"),
  content: text("content"),
  plainText: text("plain_text"),
  language: text("language").default("en"),
  folder: text("folder").default("root"),
  wordCount: integer("word_count").default(0),
  charCount: integer("char_count").default(0),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  shareToken: text("share_token"),
  isStarred: integer("is_starred", { mode: "boolean" }).default(false),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Verification Tokens
export const verificationTokens = sqliteTable("verification_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: text("token").unique().notNull(),
  type: text("type").notNull(),
  expiresAt: text("expires_at").notNull(),
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
