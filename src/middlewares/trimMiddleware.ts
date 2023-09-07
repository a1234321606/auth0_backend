import { Context, Next } from 'koa';
// @ts-ignore because @types/koa-unless doesn't exist
import unless from 'koa-unless';

const trim = (data: any) => {
  const type = typeof (data);
  if (data != null && type === 'object') {
    Object.keys(data).forEach((key) => {
      data[key] = trim(data[key]);
    });
    return data;
  } if (type === 'string') return data.trim();
  return data;
};

const trimMiddleware = () => async (ctx: Context, next: Next) => {
  if (ctx.request.body) {
    ctx.request.body = trim(ctx.request.body);
  }
  if (ctx.request.query) {
    ctx.request.query = trim(ctx.request.query);
  }
  await next();
};
trimMiddleware.unless = unless;

export default trimMiddleware;
