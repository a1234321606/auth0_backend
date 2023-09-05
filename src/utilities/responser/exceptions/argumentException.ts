import IError from '../interfaces/ierror';

export default class ArgumentException extends Error implements IError {
  name: string = 'Arguments Exception';

  message: string = 'Bad Request';

  status: number = 400;

  stack?: string | undefined;

  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}
