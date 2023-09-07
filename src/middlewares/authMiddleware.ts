import jwt from 'koa-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config';

const authMiddleware = () => jwt({
  secret: jwksRsa.koaJwtSecret({
    jwksUri: `https://${config.auth.domain}/.well-known/jwks.json`,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  }),
  audience: `https://${config.auth.domain}/api/v2/`,
  issuer: `https://${config.auth.domain}/`,
}).unless({ path: [...config.auth.unless, /\/*.yaml/] });

export default authMiddleware;
