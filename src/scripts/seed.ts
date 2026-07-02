import { db } from "@/src/db";
import { categories } from "@/src/db/schema";

const defaultCategories = [
  { name: "소설", icon: "📖", isDefault: true },
  { name: "비소설", icon: "📚", isDefault: true },
  { name: "개발/IT", icon: "💻", isDefault: true },
  { name: "자기계발", icon: "🚀", isDefault: true },
  { name: "비즈니스", icon: "💼", isDefault: true },
  { name: "역사/인문", icon: "🏛️", isDefault: true },
  { name: "과학", icon: "🔬", isDefault: true },
  { name: "기타", icon: "📕", isDefault: true },
];

export async function seedCategories() {
  try {
    const existing = await db.select().from(categories);
    if (existing.length === 0) {
      for (const cat of defaultCategories) {
        await db.insert(categories).values(cat);
      }
      console.log("✓ Categories seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}
