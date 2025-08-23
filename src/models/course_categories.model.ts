import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { Course } from "./courses.model";

@Table({ tableName: "course_categories", timestamps: true })
export class CourseCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @HasMany(() => Course)
  classes!: Course[];
}
