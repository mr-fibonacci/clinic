import { CustomError } from './custom-error';

export class ResourceUnavailableError extends CustomError {
  constructor(message: string) {
    super(`Sorry, resource unavailable. ${message}`);
    Object.setPrototypeOf(this, ResourceUnavailableError.prototype);
  }
  statusCode = 403;
}
