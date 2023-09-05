import IError from '../interfaces/ierror';

export default class ForbiddenException extends Error implements IError {
  name: string = 'Authorization Exception';

  message: string = 'Forbidden';

  status: number = 403;

  stack?: string | undefined;

  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}
