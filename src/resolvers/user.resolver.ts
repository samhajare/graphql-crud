import { User } from "../entity/User";
import { getRepository } from "typeorm";
import fs from "fs";
import path from "path";

async function handleUpload(file: any) {
  if (!file) return null;

  const { createReadStream, filename } = await file;
  const stream = createReadStream();

  const uploadDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const filePath = path.join(uploadDir, filename);
  const writeStream = fs.createWriteStream(filePath);
  stream.pipe(writeStream);

  return `/uploads/${filename}`;
}

export const userResolvers = {
  Upload: {
    // required for Upload scalar support (Apollo v3)
  },

  Query: {
    getUsers: () => getRepository(User).find(),
    getUser: (_, { id }) => getRepository(User).findOneBy({ id })
  },

  Mutation: {
    createUser: async (_, { name, email, file }) => {
      const image_url = await handleUpload(file);

      const user = getRepository(User).create({ name, email, image_url });
      return await getRepository(User).save(user);
    },

    updateUser: async (_, { id, name, email, file }) => {
      const repo = getRepository(User);

      const image_url = await handleUpload(file);
      await repo.update(id, { name, email, image_url });

      return await repo.findOneBy({ id });
    },

    deleteUser: async (_, { id }) => {
      await getRepository(User).delete(id);
      return "User deleted successfully";
    }
  }
};
