import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { InstanceType, prop as Property, Typegoose } from "typegoose";

import { connection } from "../db";

@ObjectType()
export class User extends Typegoose {
  @Field(_type => ID)
  readonly _id: ObjectId;

  @Field()
  @Property()
  email: string;

  @Field()
  @Property({ default: "Default" })
  name: string;

  @Field()
  @Property()
  password: string;

  @Field()
  @Property({ default: false })
  admin: boolean;
}

export const UserModel = new User().getModelForClass(User, {
  existingConnection: connection,
});

export type UserInstance = InstanceType<typeof UserModel>;
