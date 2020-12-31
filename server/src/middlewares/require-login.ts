import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session?.currentUser) {
    throw new NotAuthorizedError('Please sign in');
  }
  next();
};
