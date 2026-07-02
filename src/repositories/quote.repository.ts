import { db } from "@/src/db";
import { quotes } from "@/src/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface CreateQuoteInput {
  bookId: number;
  text: string;
  pageNumber?: number;
  tags?: string;
}

export interface UpdateQuoteInput {
  text?: string;
  pageNumber?: number;
  tags?: string;
}

export class QuoteRepository {
  async create(input: CreateQuoteInput) {
    const result = await db.insert(quotes).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db.select().from(quotes).where(eq(quotes.id, id));
    return result[0] || null;
  }

  async findByBookId(bookId: number, limit = 5) {
    return await db
      .select()
      .from(quotes)
      .where(eq(quotes.bookId, bookId))
      .orderBy(desc(quotes.createdAt))
      .limit(limit);
  }

  async countByBookId(bookId: number) {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(quotes)
      .where(eq(quotes.bookId, bookId));
    return result[0]?.count || 0;
  }

  async update(id: number, input: UpdateQuoteInput) {
    const result = await db
      .update(quotes)
      .set(input)
      .where(eq(quotes.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    await db.delete(quotes).where(eq(quotes.id, id));
    return true;
  }

  async findAll(limit = 100, offset = 0) {
    return await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt))
      .limit(limit)
      .offset(offset);
  }
}

export const quoteRepository = new QuoteRepository();
