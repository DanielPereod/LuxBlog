import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID, { nullable: false })
  @PrimaryColumn()
  readonly id: string = uuidv4();

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column()
  password!: string;
}
