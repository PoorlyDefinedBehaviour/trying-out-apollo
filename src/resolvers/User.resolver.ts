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
import { ApolloError } from "apollo-server-core";
import requireAuthentication from "../middlewares/RequireAuthentication";
import { compare } from "bcryptjs";
import Jwt from "../lib/Jwt.lib";
import UserRegisterArgs from "../graphql-args/UserRegister.args";

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) { }

  @UseMiddleware(requireAuthentication)
  @Query(() => User, { nullable: true })
  async findUserById(@Arg("id") id: string) {
    const user = await this.userService.findOneBy({ id });

    return user;
  }

  @Mutation(() => User)
  async registerUser(@Arg("payload") payload: UserRegisterArgs, @Ctx() { res }) {
    const userExists = await this.userService.userExists({
      email: payload.email
    });
    if (userExists) {
      throw new ApolloError("Email already in use", "422");
    }

    const user = await this.userService.create(payload);

    const token = await Jwt.encode({ id: user.id });
    res.set("authorization", `Bearer ${token}`);

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
  @UseMiddleware(requireAuthentication)
  async deleteUser(@Ctx() { req }) {
    await this.userService.deleteOneBy({ id: req.user.id });
    return true;
  }
}
