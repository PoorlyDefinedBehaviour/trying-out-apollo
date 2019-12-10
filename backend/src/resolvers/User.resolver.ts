import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import uuid from "uuid";
import Queue from "bull";
import User from "../entity/User.entity";
import UserRegisterArgs from "../graphql-args/UserRegister.args";
import PREFIXES from "../config/Prefixes.config";
import { ApolloError } from "apollo-server-core";
import ResetPasswordArgs from "../graphql-args/ResetPassword.args";
import ChangePasswordArgs from "../graphql-args/ChangePassword.args";
import sessionRequired from "../middlewares/SessionRequired.middleware";

const emailQueue = new Queue("email");

@Resolver(() => User)
export default class UserResolver {
  @Mutation(() => User)
  async registerUser(
    @Arg("payload") payload: UserRegisterArgs,
    @Ctx() { req, redis }
  ) {
    const user = new User();
    user.email = payload.email;
    await user.setPassword(payload.password);
    await user.save();

    req.session.userId = user.id;
    await redis.lpush(`${PREFIXES.redis}:${user.id}`, req.sessionID);

    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg("payload") { email, password }: UserRegisterArgs,
    @Ctx() { req, redis }
  ) {
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordCorrect(password))) {
      throw new ApolloError("Invalid credentials");
    }

    req.session.userId = user.id;
    await redis.lpush(`${PREFIXES.redis}:${user.id}`, req.sessionID);

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, redis }) {
    await redis.del(`${PREFIXES.redis}${req.session.userId}`);
    req.session.destroy();
    return true;
  }

  @Mutation(() => Boolean)
  async sendPasswordResetEmail(
    @Arg("payload") { email }: ResetPasswordArgs,
    @Ctx() { req, redis }
  ) {
    const user = await User.findOne({ email });

    if (user) {
      const token = uuid.v4();
      const expiresIn = 60 * 15;

      await redis.set(
        `${PREFIXES.passwordReset}${token}`,
        user.id,
        "ex",
        expiresIn
      );

      emailQueue.add({
        to: email,
        link: `http://${req.headers.host}/reset-password/${token}`
      });
    }

    return true;
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("payload") { password, token }: ChangePasswordArgs,
    @Ctx() { redis }
  ) {
    const redisKey = `${PREFIXES.passwordReset}${token}`;

    const userId = await redis.get(redisKey);
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new ApolloError("Invalid token");
    }

    await user.setPassword(password);
    await user.save();
    await redis.del(redisKey);

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(sessionRequired)
  async deleteAccount(@Ctx() { req, redis }) {
    const id = req.session.userId;
    await redis.del(`${PREFIXES.redis}:${id}`);
    await User.delete({ id });
    req.session.destroy();
    return true;
  }
}
