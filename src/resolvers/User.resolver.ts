import {
  Resolver,
  Mutation,
  Arg,
  Query,
  UseMiddleware,
  Ctx
} from "type-graphql";
import User from "../entity/User.entity";
import UserService from "../services/User.service";
import UserRegisterArgs from "../dtos/UserRegisterArgs.dto";
import { ApolloError } from "apollo-server-core";
import isAuthenticated from "../middlewares/IsAuthenticated.middleware";
import { compare } from "bcryptjs";
import Jwt from "../lib/Jwt.lib";

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

  @Mutation(() => User)
  async login(@Arg("payload") payload: UserRegisterArgs, @Ctx() { res }) {
    const user = await this.userService.findOneBy(
      { email: payload.email },
      { select: ["id", "email", "password"] }
    );
    if (!user) {
      throw new ApolloError("Invalid credentials", "401");
    }

    const validCredentials = await compare(payload.password, user.password);
    if (!validCredentials) {
      throw new ApolloError("Invalid credentials", "401");
    }

    const token = await Jwt.encode({ id: user.id });
    res.set("authorization", `Bearer ${token}`);

    return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteUser(@Arg("id") id: string) {
    await this.userService.deleteOneBy({ id });
    return true;
  }
}
