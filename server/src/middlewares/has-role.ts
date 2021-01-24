import { NextFunction, Request, Response } from 'express';
import { EntityTarget, getRepository } from 'typeorm';
import { Medic } from '../entity/medic';
import { Patient } from '../entity/patient';
import { NotAuthorizedError } from '../errors/not-authorized-error';

type Role = Patient | Medic;

export const hasRole = (roleEntity: EntityTarget<Role>) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.session?.currentUser?.id;
  const roleRepo = getRepository(roleEntity);
  if (!id) throw new NotAuthorizedError('Please log in');

  const role = await roleRepo.findOne({ where: { user: { id } } });
  if (!role) throw new NotAuthorizedError(`Can't access the API`);

  next();
};
