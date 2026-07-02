import {
  sqliteTable,
  text,
  integer,
  real,
  blob,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").unique().notNull(),
  icon: text("icon"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const books = sqliteTable("books", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  isbn: text("isbn").unique(),
  categoryId: integer("category_id").references(() => categories.id),
  coverImageUrl: text("cover_image_url"),
  status: text("status", {
    enum: ["not_started", "reading", "completed"],
  }).default("not_started"),
  currentPage: integer("current_page").default(0),
  totalPages: integer("total_pages"),
  rating: integer("rating"), // 1-5
  completedDate: integer("completed_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .$onUpdateFn(() => new Date()),
});

export const quotes = sqliteTable("quotes", {
  id: integer("id").primaryKey(),
  bookId: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  pageNumber: integer("page_number"),
  tags: text("tags"), // comma-separated
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey(),
  quoteId: integer("quote_id")
    .references(() => quotes.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(), // markdown
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .$onUpdateFn(() => new Date()),
});

export const bookTags = sqliteTable("book_tags", {
  id: integer("id").primaryKey(),
  bookId: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  tag: text("tag").notNull(), // topic, recommendation, etc.
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const readingHistory = sqliteTable("reading_history", {
  id: integer("id").primaryKey(),
  bookId: integer("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  pageBefore: integer("page_before"),
  pageAfter: integer("page_after").notNull(),
  recordedAt: integer("recorded_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});
