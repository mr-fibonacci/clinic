import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  constructor(message: string) {
    super(`Not authorized. ${message}.`);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  statusCode = 401;
}
