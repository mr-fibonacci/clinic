import { ValidationError } from 'express-validator';
import { CustomError, ErrorMessageObject } from './custom-error';

export class RequestBodyError extends CustomError {
  constructor(public errors: ValidationError[]) {
    super('Request body error');
    Object.setPrototypeOf(this, RequestBodyError.prototype);
  }
  statusCode = 422;
  mapErrors(): ErrorMessageObject {
    return {
      errors: this.errors.map((error) => ({
        message: error.msg,
        field: error.param
      }))
    };
  }
}
