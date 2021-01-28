import { NextFunction, Request, Response } from 'express';
import { EntityTarget, getRepository } from 'typeorm';
import { Medic } from '../entity/medic';
import { OfficeAdmin } from '../entity/office-admin';
import { Patient } from '../entity/patient';
import { User } from '../entity/user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import dotenv from 'dotenv';

dotenv.config();
const { ADMIN_EMAIL } = process.env;

type Role = Patient | Medic | OfficeAdmin;

export const hasRole = (roleEntity: EntityTarget<Role>) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.session?.currentUser?.id;

  const isAdmin = !!getRepository(User).findOne({
    where: { id, email: ADMIN_EMAIL }
  });

  if (isAdmin) return next();

  if (!id) throw new NotAuthorizedError('Please log in');

  const role = await getRepository(roleEntity).findOne({
    where: { user: { id } }
  });
  if (!role) throw new NotAuthorizedError(`Can't access the API`);

  next();
};
