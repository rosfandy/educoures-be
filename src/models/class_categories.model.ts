import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { Class } from "./classes.model";

@Table({ tableName: "class_categories", timestamps: false })
export class ClassCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @HasMany(() => Class)
  classes!: Class[];
}
