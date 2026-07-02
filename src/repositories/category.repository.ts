import { db } from "@/src/db";
import { categories } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export interface CreateCategoryInput {
  name: string;
  icon?: string;
  isDefault?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
}

export class CategoryRepository {
  async create(input: CreateCategoryInput) {
    const result = await db.insert(categories).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return result[0] || null;
  }

  async findAll() {
    return await db.select().from(categories).orderBy(desc(categories.isDefault), categories.name);
  }

  async findDefault() {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isDefault, true))
      .orderBy(categories.name);
  }

  async update(id: number, input: UpdateCategoryInput) {
    const result = await db
      .update(categories)
      .set(input)
      .where(eq(categories.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    // Don't allow deletion of default categories
    const cat = await this.findById(id);
    if (cat?.isDefault) {
      throw new Error("Cannot delete default category");
    }
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }
}

export const categoryRepository = new CategoryRepository();
