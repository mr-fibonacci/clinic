import { NextFunction, Request, Response } from 'express';
import { SequelizeModel } from '../custom-types-consts';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const hasRole = (roleModel: SequelizeModel) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.session?.currentUser.id;
  if (!id) throw new NotAuthorizedError('Please log in');
  const role = await roleModel.findAll({ where: { UserId: id } });
  if (!role) throw new NotAuthorizedError(`Can't access the API`);

  next();
};
