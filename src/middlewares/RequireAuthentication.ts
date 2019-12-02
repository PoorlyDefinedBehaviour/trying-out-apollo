import Jwt from "../lib/Jwt.lib";
import { ApolloError } from "apollo-server-core";
import UserService from "../services/User.service";

export default async function requireAuthentication({ context }, next) {
  const payload = await Jwt.decode(context.req.headers.authorization);
  if (!payload) {
    throw new ApolloError("Unauthorized", "401");
  }

  const user = new UserService().findOneBy({ id: payload.id });;
  if (!user) {
    throw new ApolloError("Unauthorized", "401");
  }

  context.req.user = user;
  return next();
}
