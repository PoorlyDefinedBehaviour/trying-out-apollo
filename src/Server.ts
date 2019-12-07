import "reflect-metadata";
import load from "process-env-loader";
load();
import express from "express";
import cors from "cors";
import { createConnection, getConnectionOptions } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import loadResolvers from "./utils/LoadResolvers";
import loggingMiddleware from "./middlewares/Logging.middleware";
import { Server } from "http";

export const app = express();

export default async function startServer(): Promise<Server> {
  app.use(express.json());
  app.use(cors());
  app.use(loggingMiddleware);

  const connectionOptions = await getConnectionOptions(
    process.env.NODE_ENV || "dev"
  );
  await createConnection({ ...connectionOptions, name: "default" });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: loadResolvers(),
      container: Container
    }),
    context: ({ req, res }) => ({ req, res }),
    debug: true
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 8080;
  return app.listen(port, () => console.log(`Listening on PORT => ${port} 🚀`));
}
