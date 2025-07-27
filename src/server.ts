import express from "express";
import routes from "./api/routes/routes";
import { sequelize } from "./config/db";
import { seedCategories } from "./seeders/categories.seeder";

const app = express();
const port = process.env.PORT || 3000;

(async () => {
  await sequelize.sync();
  await seedCategories();
})();

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
