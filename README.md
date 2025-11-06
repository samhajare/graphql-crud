# GraphQL + TypeORM (Postgres) API

A simple GraphQL API using Apollo Server, Express, TypeORM v0.3, and PostgreSQL. Includes migrations and example operations for creating and fetching users.

## Prerequisites
- Node.js 18+ (Node 22 supported)
- PostgreSQL running locally
- pnpm/npm installed

## Project Structure
```
src/
  entity/
    User.ts
  resolvers/
    user.resolver.ts
  migration/
    <timestamp>-UserTable.ts
  data-source.ts
  index.ts
schema.ts
ormconfig.json (legacy; not used by CLI in v0.3)
```

## Install
```bash
npm install
```

## Environment
`src/data-source.ts` is configured with default local Postgres credentials:
- host: localhost
- port: 5432
- username: postgres
- password: admin
- database: graph_ql_db

Update these values in `src/data-source.ts` if needed.

## Scripts
```bash
# Start dev server (uses tsx to run TS/ESM)
npm run dev

# TypeORM CLI (uses ts-node ESM loader with data source)
# Generate migration (positional path/name required by TypeORM)
npm run typeorm migration:generate -- src/migration/<Name>

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

Examples:
```bash
# Generate migration for user table
npm run typeorm migration:generate -- src/migration/UserTable

# Apply migrations
npm run typeorm migration:run
```

## Data Source (TypeORM v0.3)
- CLI uses `-d src/data-source.ts` via the `typeorm` script (already set in `package.json`).
- Entities and migrations are referenced with TS globs in `src/data-source.ts`.

## Entity
`src/entity/User.ts`:
- id: PrimaryGeneratedColumn
- name: varchar
- email: varchar
- profile_url: varchar (nullable)
- created_at: auto timestamp
- updated_at: auto timestamp

## GraphQL Schema
`src/schema.ts` defines:
- Query
  - getUsers: [User]
  - getUser(id: Int!): User
- Mutation
  - createUser(name: String!, email: String!): User
  - updateUser(id: Int!, name: String, email: String): User
  - deleteUser(id: Int!): String

## GraphQL Operations
- Create a user
```graphql
mutation CreateUser {
  createUser(name: "Alice", email: "alice@example.com") {
    id
    name
    email
  }
}
```

- Get all users
```graphql
query GetUsers {
  getUsers {
    id
    name
    email
  }
}
```

- Get one user by ID (with variables)
```graphql
query GetUser($id: Int!) {
  getUser(id: $id) {
    id
    name
    email
  }
}
```
Variables:
```json
{
  "id": 1
}
```

- Update a user
```graphql
mutation UpdateUser($id: Int!, $name: String, $email: String) {
  updateUser(id: $id, name: $name, email: $email) {
    id
    name
    email
  }
}
```
Variables:
```json
{
  "id": 1,
  "name": "Alice Updated"
}
```

- Delete a user
```graphql
mutation DeleteUser($id: Int!) {
  deleteUser(id: $id)
}
```
Variables:
```json
{
  "id": 1
}
```

## Common Issues
- ESM/TypeScript loaders: This project uses `tsx` for dev and `ts-node/esm` for TypeORM CLI.
- If you see ColumnTypeUndefinedError, ensure `tsconfig.json` has:
  - "experimentalDecorators": true
  - "emitDecoratorMetadata": true
  and that your columns have explicit `type` where needed.
- If CLI can’t find the data source, ensure imports include the `.ts` extension in ESM paths (e.g. `./data-source.ts`).

## Start
```bash
npm run dev
# GraphQL Playground: http://localhost:4000/graphql
```


