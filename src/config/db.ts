import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import { Class } from "../models/classes.model";
import { ClassCategory } from "../models/class_categories.model";

const dbDir = path.resolve(__dirname, "../db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(dbDir, "db.sqlite"),
  models: [Class, ClassCategory],
});
