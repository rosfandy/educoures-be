import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import { Course, CourseCategory, User } from "../models";

const dbDir = path.resolve(__dirname, "../db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(dbDir, "db.sqlite"),
  models: [Course, CourseCategory, User],
});
