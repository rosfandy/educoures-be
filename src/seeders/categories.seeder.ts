import { ClassCategory } from "../models/class_categories.model";

export async function seedCategories() {
  const count = await ClassCategory.count();
  if (count > 0) {
    console.log("🔁 Categories already seeded");
    return;
  }

  await ClassCategory.bulkCreate([
    { name: "Frontend" },
    { name: "Backend" },
    { name: "DevOps" },
    { name: "Mobile" },
    { name: "UI/UX" },
  ]);

  console.log("✅ Seeded class categories");
}
