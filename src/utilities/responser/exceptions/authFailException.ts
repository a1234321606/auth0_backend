import IError from '../interfaces/ierror';

export default class AuthFailException extends Error implements IError {
  name: string = 'Auth Fail Exception';

  message: string = 'Precondition Failed';

  status: number = 412;

  stack?: string | undefined;

  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}
