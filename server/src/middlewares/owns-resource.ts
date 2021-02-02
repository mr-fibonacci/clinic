import { NextFunction, Request, Response } from 'express';
import { EntityTarget, getRepository } from 'typeorm';
import { Resource } from '../custom-types-consts';
import { Secretary } from '../entity/secretary';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { hasRole } from '../utils/has-role';
import { isAdmin } from '../utils/is-admin';

export const ownsResource = (resourceEntity: EntityTarget<Resource>) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.session?.currentUser?.id;
  const { resourceId } = req.params;

  if (!userId) throw new NotAuthorizedError('Please sign in');

  const [resource, ...entities] = await Promise.all([
    getRepository(resourceEntity).findOne(resourceId), //?.isOwnedByUser(userId)
    isAdmin(userId),
    ...hasRole(userId, [Secretary])
  ]);

  const isOwnedByUser = resource?.isOwnedByUser(userId);

  const ownsResource = [isOwnedByUser, ...entities].some((entity) => !!entity);
  if (!ownsResource)
    throw new NotAuthorizedError(`You do not own the resource`);

  next();
};
