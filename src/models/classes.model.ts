import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ClassCategory } from "./class_categories.model";

@Table({ tableName: "classes", timestamps: false })
export class Class extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  description!: string;

  @ForeignKey(() => ClassCategory)
  @Column
  category_id!: number;

  @BelongsTo(() => ClassCategory)
  category!: ClassCategory;
}
