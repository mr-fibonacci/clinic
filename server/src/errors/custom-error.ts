interface CustomErrorInterface {
  message: string;
  field?: string;
}

export interface ErrorMessageObject {
  errors: CustomErrorInterface[];
}

export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract statusCode: number;
  mapErrors(): ErrorMessageObject {
    return { errors: [{ message: this.message }] };
  }
}
