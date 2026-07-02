import { db } from "@/src/db";
import { books } from "@/src/db/schema";
import { eq, like, and, desc, sql } from "drizzle-orm";

export interface CreateBookInput {
  title: string;
  author?: string;
  isbn?: string;
  categoryId?: number;
  totalPages?: number;
  coverImageUrl?: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  categoryId?: number;
  totalPages?: number;
  coverImageUrl?: string;
  status?: "not_started" | "reading" | "completed";
  currentPage?: number;
  rating?: number;
  completedDate?: Date;
}

export class BookRepository {
  async create(input: CreateBookInput) {
    const result = await db.insert(books).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db.select().from(books).where(eq(books.id, id));
    return result[0] || null;
  }

  async findAll(limit = 50, offset = 0) {
    return await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async findByStatus(status: "not_started" | "reading" | "completed") {
    return await db
      .select()
      .from(books)
      .where(eq(books.status, status))
      .orderBy(desc(books.createdAt));
  }

  async search(query: string) {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(books)
      .where(
        and(
          like(books.title, searchTerm),
          like(books.author, searchTerm)
        )
      )
      .orderBy(desc(books.createdAt));
  }

  async update(id: number, input: UpdateBookInput) {
    const result = await db
      .update(books)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(books.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    await db.delete(books).where(eq(books.id, id));
    return true;
  }

  async findByCategory(categoryId: number) {
    return await db
      .select()
      .from(books)
      .where(eq(books.categoryId, categoryId))
      .orderBy(desc(books.createdAt));
  }

  async findCompleted(limit = 100) {
    return await db
      .select()
      .from(books)
      .where(eq(books.status, "completed"))
      .orderBy(desc(books.completedDate))
      .limit(limit);
  }

  async getStats() {
    const result = await db
      .select({
        total: sql<number>`COUNT(*)`,
        reading: sql<number>`COUNT(CASE WHEN ${books.status} = 'reading' THEN 1 END)`,
        completed: sql<number>`COUNT(CASE WHEN ${books.status} = 'completed' THEN 1 END)`,
        avgRating: sql<number>`AVG(CAST(${books.rating} AS FLOAT))`,
      })
      .from(books);
    return result[0] || { total: 0, reading: 0, completed: 0, avgRating: 0 };
  }

  async getMonthlyStats(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const startTime = Math.floor(startDate.getTime() / 1000) * 1000;
    const endTime = Math.floor(endDate.getTime() / 1000) * 1000;

    const result = await db
      .select({
        count: sql<number>`COUNT(*)`,
        avgRating: sql<number>`AVG(CAST(${books.rating} AS FLOAT))`,
      })
      .from(books)
      .where(
        and(
          sql`${books.completedDate} >= ${startTime}`,
          sql`${books.completedDate} <= ${endTime}`
        )
      );
    return result[0] || { count: 0, avgRating: 0 };
  }
}

export const bookRepository = new BookRepository();
