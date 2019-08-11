import { Authorized, Query, Resolver } from "type-graphql";

import { ADMIN } from "../consts";
import { User, UserModel } from "../entities/user";

@Resolver(_of => User)
export class UserResolver {
  @Authorized([ADMIN])
  @Query(_returns => [User])
  async users() {
    return await UserModel.find();
  }
}
