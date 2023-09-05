import IError from '../interfaces/ierror';

export default class ServerException extends Error implements IError {
  name: string = 'Server Exception';

  message: string = 'Internal Server Exception';

  status: number = 500;

  stack?: string | undefined;

  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}
