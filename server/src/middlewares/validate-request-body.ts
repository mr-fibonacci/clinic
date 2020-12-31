import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { RequestBodyError } from '../errors/request-body-error';

export const validateRequestBody = (
  chainArr: ValidationChain[]
): [
  ValidationChain[],
  (req: Request, res: Response, next: NextFunction) => void
] => [
  chainArr,
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      throw new RequestBodyError(errors.array());
    }
    next();
  }
];
