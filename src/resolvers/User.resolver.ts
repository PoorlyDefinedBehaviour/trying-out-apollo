import { Resolver, Mutation, Arg, Query, UseMiddleware } from "type-graphql";
import User from "../entity/User.entity";
import UserService from "../services/User.service";
import UserRegisterArgs from "../dtos/UserRegisterArgs.dto";
import { ApolloError } from "apollo-server-core";
import isAuthenticated from "../middlewares/IsAuthenticated.middleware";

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseMiddleware(isAuthenticated)
  @Query(() => User, { nullable: true })
  async findOneById(@Arg("id") id: string) {
    const user = await this.userService.findOneBy({ id });

    return user;
  }

  @Mutation(() => User)
  async register(@Arg("payload") payload: UserRegisterArgs) {
    const userExists = await this.userService.userExists({
      email: payload.email
    });
    if (userExists) {
      throw new ApolloError("Email already in use", "422");
    }

    const user = await this.userService.create(payload);
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: string) {
    await this.userService.deleteOneBy({ id });
    return true;
  }
}
