import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, ID } from "type-graphql";
import { v4 as uuidv4 } from "uuid";

@Entity()
@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  @PrimaryKey()
  readonly id = uuidv4();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ type: "text" })
  password!: string;
}
