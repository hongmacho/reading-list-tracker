import { db } from "@/src/db";
import { notes } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface CreateNoteInput {
  quoteId: number;
  content: string;
}

export interface UpdateNoteInput {
  content?: string;
}

export class NoteRepository {
  async create(input: CreateNoteInput) {
    const result = await db.insert(notes).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0] || null;
  }

  async findByQuoteId(quoteId: number) {
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.quoteId, quoteId));
    return result[0] || null;
  }

  async update(id: number, input: UpdateNoteInput) {
    const result = await db
      .update(notes)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    await db.delete(notes).where(eq(notes.id, id));
    return true;
  }

  async upsert(quoteId: number, content: string) {
    const existing = await this.findByQuoteId(quoteId);
    if (existing) {
      return await this.update(existing.id, { content });
    }
    return await this.create({ quoteId, content });
  }
}

export const noteRepository = new NoteRepository();
