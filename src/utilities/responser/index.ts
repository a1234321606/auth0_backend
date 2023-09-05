import { IRouterContext } from 'koa-router';
import IError from './interfaces/ierror';

/**
 * Attach status code and body on the context object provided by Koa
 *
 * @param {object} ctx the context object provided by Koa
 * @param {number} [status=200] HTTP returning status code
 * @param {object|undefined} [body=undefined] HTTP returning body
 */
const finalize = (ctx: IRouterContext, status: number = 200, body: any = '') => {
  ctx.status = status;
  if (body) ctx.body = body;
};

const finalizeStream = (ctx: IRouterContext, filename: any, stream: any) => {
  ctx.set('Content-disposition', `attachment; filename=${filename}`);
  ctx.body = stream;
};

const finalizeError = (ctx: IRouterContext, error: IError) => {
  ctx.status = error.status ?? 500;
  ctx.body = {
    message: error.message,
    status: error.status,
  };
};

export default {
  finalize,
  finalizeStream,
  finalizeError,
};
export {
  IError,
};
