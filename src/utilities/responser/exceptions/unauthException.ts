import IError from '../interfaces/ierror';

export default class UnauthException extends Error implements IError {
  name: string = 'Unauth Exception';

  message: string = 'Unauthorized';

  status: number = 401;

  stack?: string | undefined;

  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}
