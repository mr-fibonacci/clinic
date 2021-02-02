import { getRepository } from 'typeorm';
import { User } from '../entity/user';
import dotenv from 'dotenv';
dotenv.config();

const { ADMIN_EMAIL } = process.env;

export const isAdmin = (userId: string): Promise<User | undefined> => {
  return getRepository(User).findOne({
    where: { id: userId, email: ADMIN_EMAIL }
  });
};
