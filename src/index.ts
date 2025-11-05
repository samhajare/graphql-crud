import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { typeDefs } from "./schema";
import { userResolvers } from "./resolvers/user.resolver";
import { User } from "./entity/User";
import path from "path";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,     // using migrations now
  entities: [User],
  migrations: ["src/migration/*.ts"]
});

(async () => {
  await AppDataSource.initialize();

  const app = express();
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use(graphqlUploadExpress());

  const server = new ApolloServer({
    typeDefs,
    resolvers: userResolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
})();
