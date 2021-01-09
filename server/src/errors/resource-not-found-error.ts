import { CustomError } from './custom-error';

export class ResourceNotFoundError extends CustomError {
  constructor(resourceName: string) {
    super(`${resourceName} not found.`);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
  statusCode = 404;
}
