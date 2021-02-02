import { NextFunction, Request, Response } from 'express';
import { EntityTarget } from 'typeorm';
import { User } from '../entity/user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { Employee } from '../entity/employee';
import { Patient } from '../entity/patient';
import { isAdmin } from '../utils/is-admin';
import { hasRole } from '../utils/has-role';

export const isAdminOr = (
  roleEntities: EntityTarget<Patient | Employee>[] = []
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.session?.currentUser?.id;
  if (!id) throw new NotAuthorizedError('Please log in');

  // TS compiler likes consistent Promise.all types; otherwise have to resort to generics
  const resolvedArr = await Promise.all<User | Patient | Employee | undefined>([
    isAdmin(id),
    ...hasRole(id, roleEntities)
  ]);

  const isAdminOr = resolvedArr.some((entity) => !!entity);
  if (!isAdminOr) throw new NotAuthorizedError(`Can't access the API`);

  next();
};
