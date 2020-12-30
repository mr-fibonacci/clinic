import { Request, Response, NextFunction } from 'express';

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session?.currentUser) {
    throw new Error('Please log in!');
  }
  next();
};
