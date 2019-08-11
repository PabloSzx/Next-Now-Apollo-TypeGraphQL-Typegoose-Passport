import { IsEmail, Length } from "class-validator";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { USER_ALREADY_EXISTS, WRONG_INFO } from "../consts";
import { User, UserModel } from "../entities";
import { IContext } from "../interfaces";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(3, 100)
  password: string;
}

@InputType()
export class SignUpInput extends LoginInput {
  @Field({ nullable: true, defaultValue: "Default" })
  name: string;

  @Field({ nullable: true, defaultValue: false })
  admin: boolean;
}

@Resolver()
export class AuthResolver {
  @Query(_returns => User, { nullable: true })
  async current_user(@Ctx() { isAuthenticated, user }: IContext) {
    if (isAuthenticated()) {
      return user;
    }
  }

  @Mutation(_returns => User, { nullable: true })
  async login(
    @Arg("input") { email, password }: LoginInput,
    @Ctx() { login }: IContext
  ) {
    try {
      const user = await UserModel.findOne({
        email,
      });

      if (user) {
        if (user.password !== password) {
          throw new Error(WRONG_INFO);
        } else {
          await login(user);
        }
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  @Mutation(_returns => Boolean)
  logout(@Ctx() { logout, isAuthenticated }: IContext) {
    if (isAuthenticated()) {
      logout();
      return true;
    }
    return false;
  }

  @Mutation(_returns => User, { nullable: true })
  async sign_up(
    @Arg("input") { email, password, name, admin }: SignUpInput,
    @Ctx() { login }: IContext
  ) {
    try {
      if (
        !(await UserModel.findOne({
          email,
        }))
      ) {
        const user = await UserModel.create({
          email,
          password,
          name,
          admin,
        });
        await login(user);

        return user;
      } else throw new Error(USER_ALREADY_EXISTS);
    } catch (err) {
      throw err;
    }
  }
}
