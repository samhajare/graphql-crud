import { User } from "../entity/User";
import AppDataSource from "../data-source.ts";

export const userResolvers = {
  Query: {
    getUsers: () => AppDataSource.getRepository(User).find(),
    getUser: (_, { id }) => AppDataSource.getRepository(User).findOneBy({ id })
  },

  Mutation: {
    createUser: async (_, { name, email }) => {
      const repo = AppDataSource.getRepository(User);
      const user = repo.create({ name, email });
      return await repo.save(user);
    },

    updateUser: async (_, { id, name, email }) => {
      const repo = AppDataSource.getRepository(User);
      await repo.update(id, { name, email });
      return await repo.findOneBy({ id });
    },

    deleteUser: async (_, { id }) => {
      await AppDataSource.getRepository(User).delete(id);
      return "User deleted successfully";
    }
  }
};
