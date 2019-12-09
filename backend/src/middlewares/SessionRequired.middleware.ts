import { ApolloError } from "apollo-server-core";

export default async function sessionRequired({ context }, next) {
  if (!context.req.session || !context.req.session.userId) {
    throw new ApolloError("Unauthorized", "401");
  }

  return next();
}
