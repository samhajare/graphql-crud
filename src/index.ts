import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { typeDefs } from "./schema";
import { userResolvers } from "./resolvers/user.resolver";
import { User } from "./entity/User";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User],
});

(async () => {
  await AppDataSource.initialize();

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers: userResolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 GraphQL Server running at http://localhost:4000/graphql`);
  });
})();
