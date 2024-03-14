import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
} from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @Column()
  telegramId: number;

  @Column("simple-array")
  favorites: string[];
}
