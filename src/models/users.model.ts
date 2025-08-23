import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "users", timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  fullname!: string;

  @Column
  username!: string;

  @Column
  email!: string;

  @Column
  password!: string;

  @Column(DataType.DATE)
  email_verified_at!: Date | null;

  @Column(DataType.STRING)
  verification_token!: string | null;
}
