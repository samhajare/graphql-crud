import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    name: String!
    email: String!
    profile_url: String
    created_at: String
    updated_at: String
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, file: Upload): User
    updateUser(id: ID!, name: String, email: String, file: Upload): User
    deleteUser(id: ID!): String
  }
`;
