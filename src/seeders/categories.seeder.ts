import { CourseCategory } from "../models";

export async function seedCategories() {
  const count = await CourseCategory.count();
  if (count > 0) {
    console.log("🔁 Categories already seeded");
    return;
  }

  await CourseCategory.bulkCreate([
    { name: "Frontend" },
    { name: "Backend" },
    { name: "DevOps" },
    { name: "Mobile" },
    { name: "UI/UX" },
  ]);

  console.log("✅ Seeded class categories");
}
