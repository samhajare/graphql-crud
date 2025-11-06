import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
// upload middleware removed (plain text only)
// Use central DataSource
import AppDataSource from "./data-source.ts";
import dotenv from "dotenv";
import { typeDefs } from "./schema";
import { userResolvers } from "./resolvers/user.resolver";
import { User } from "./entity/User";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DataSource config is defined in src/data-source.ts

(process as any).on("uncaughtException", (err: unknown) => {
  console.error("Uncaught exception:", err);
  if (err && typeof err === "object" && "stack" in (err as any)) {
    console.error((err as any).stack);
  }
});

(process as any).on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled rejection:", reason);
  if (reason && typeof reason === "object" && "stack" in (reason as any)) {
    console.error((reason as any).stack);
  }
});

(async () => {
  try {
    await AppDataSource.initialize();

    const app = express();

    const server = new ApolloServer({
      typeDefs,
      resolvers: userResolvers,
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
  } catch (err) {
    console.error("Server startup error:");
    console.error(err);
    if (err && typeof err === "object" && "stack" in (err as any)) {
      console.error((err as any).stack);
    }
    process.exit(1);
  }
})();
