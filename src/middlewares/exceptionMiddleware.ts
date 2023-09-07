import { IRouterContext } from 'koa-router';
import { Next } from 'koa';
// @ts-ignore because @types/koa-unless doesn't exist
import unless from 'koa-unless';
import responser from '../utilities/responser';
import { ServerException } from '../utilities/responser/exceptions';

const exceptionMiddleware = () => async (ctx: IRouterContext, next: Next) => {
  try {
    await next();
  } catch (error: any) {
    console.log(error);
    responser.finalizeError(ctx, error.status ? error : new ServerException(error));
  }
};
exceptionMiddleware.unless = unless;
export default exceptionMiddleware;
