import "reflect-metadata";
import load from "process-env-loader";
load("../");
import express from "express";
import cors from "cors";
import { createConnection, getConnectionOptions } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import loadResolvers from "./utils/LoadResolvers";
import loggingMiddleware from "./middlewares/Logging.middleware";
import { Server } from "http";
import rateLimiter from "./config/RateLimiter.config";
import session from "./config/Session.config";
import redis from "./config/Redis.config";

interface ServerStartResult {
  server: Server;
  port: number | string;
}

export default async function startServer(): Promise<ServerStartResult> {
  const isProductionEnv = /prod/gi.test(process.env.NODE_ENV!);

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(rateLimiter);
  app.use(session);
  isProductionEnv && app.use(loggingMiddleware);

  const connectionOptions = await getConnectionOptions(
    process.env.NODE_ENV || "dev"
  );
  await createConnection({ ...connectionOptions, name: "default" });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: loadResolvers()
    }),
    context: ({ req, res }) => ({ req, res, redis }),
    debug: !isProductionEnv
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 8080;
  return { server: app.listen(port, () => { }), port };
}
