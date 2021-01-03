import { CustomError } from './custom-error';
import { NotAuthorizedError } from './not-authorized-error';

export class ResourceNotFoundError extends CustomError {
  constructor(resourceName: string) {
    super(`${resourceName} not found.`);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  statusCode = 404;
}
