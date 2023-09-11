import { IRouterContext } from 'koa-router';
import { Next } from 'koa';
import http, { Server } from 'http';
import request from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../src/config';
import app from '../src/index';
import { users, userToken, logs } from './mocks/auth0';
import { ctxUser } from './mocks/authMiddleware';
import { UnauthException } from '../src/utilities/responser/exceptions';

const uid: String = `UT${Date.now()}`;
const token: String = jwt.sign(ctxUser, uid as Secret, { expiresIn: '1h' });
const srv: Server = http.createServer(app.callback());
const server = {
  listen: () => srv.listen(config.port),
  close: () => srv.close(),
};

jest.mock('../src/middlewares/authMiddleware', () => () => {
  const fn = async (ctx: IRouterContext, next: Next) => {
    try {
      const t = ctx.request.header.authorization?.replace('Bearer ', '') || '';
      ctx.state.user = jwt.verify(t, uid as Secret);
    } catch (e) {
      throw new UnauthException();
    }
    await next();
  };
  return fn;
});

jest.mock('../src/api/auth0', () => ({
  getUsers: jest.fn(() => users),
  getUserById: jest.fn((id: string) => users.find((u) => u.user_id === id)),
  getUserToken: jest.fn(() => userToken),
  getLogs: jest.fn(({ page }) => {
    const limit = 2;
    const data = logs.slice(page * limit, page * limit + limit);
    return { length: data.length, limit, logs: data };
  }),
  getEmailVerifyTicket: jest.fn(),
  updateUserById: jest.fn((user) => user),
  deleteUserById: jest.fn(),
  sendEmailVerifyRequest: jest.fn(),
  sendPasswordResetRequest: jest.fn(),
}));

jest.mock('../src/utilities/mailer', () => ({
  sendTestMail: jest.fn(),
  sendEmailVerificationMail: jest.fn(),
  sendAccountDeleteMail: jest.fn(),
  sendPasswordChangeMail: jest.fn(),
}));

jest.mock('../src/utilities/pg', () => ({
  query: jest.fn((sql: string) => {
    if (sql.match('SELECT id, user_id, timestamp FROM auth0_session_logs')) return { rows: logs };
    return undefined;
  }),
}));

export default request(`http://localhost:${config.port}/${config.prefix}/${config.version}`);
export {
  server,
  token,
  uid,
};
