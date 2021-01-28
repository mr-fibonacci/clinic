import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getRepository } from 'typeorm';
import { User } from '../entity/user';
import { NotAuthorizedError } from '../errors/not-authorized-error';

dotenv.config();
const { ADMIN_EMAIL } = process.env;

export const isAdmin = () => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.session?.currentUser?.id;

  const isAdmin = !!getRepository(User).findOne({
    where: { id, email: ADMIN_EMAIL }
  });

  if (!isAdmin) throw new NotAuthorizedError('Requires admin privileges');

  next();
};
