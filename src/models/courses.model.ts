import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { CourseCategory } from "./course_categories.model";

@Table({ tableName: "courses", timestamps: true })
export class Course extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  description!: string;

  @ForeignKey(() => CourseCategory)
  @Column
  category_id!: number;

  @BelongsTo(() => CourseCategory)
  category!: CourseCategory;
}
