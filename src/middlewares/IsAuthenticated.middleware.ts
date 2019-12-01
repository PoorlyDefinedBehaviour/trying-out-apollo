import Jwt from "../lib/Jwt.lib";
import { ApolloError } from "apollo-server-core";

export default async function isAuthenticated({ context }, next) {
  const payload = await Jwt.decode(context.req.headers.authorization);
  console.log("context", context.req);

  console.log("token", context.req.headers.authorization);

  console.log("isAuthenticated payload", payload);

  if (!payload) {
    throw new ApolloError("Unauthorized", "401");
  }

  return next();
}
