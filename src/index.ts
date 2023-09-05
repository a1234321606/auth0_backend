import Koa from 'koa';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import staticCache from 'koa-static-cache';
import path from 'path';
import bodyParser from 'koa-body';
import jwt from 'koa-jwt';
import jwksRsa from 'jwks-rsa';
import config from './config';
import router from './router';
import trimMiddleware from './middleware/trimMiddleware';
import exceptionMiddleware from './middleware/exceptionMiddleware';

const app = new Koa();

// Handle CORS OPTIONS request
app.use(cors({
  origin: () => '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Authorization'],
  credentials: true,
  allowMethods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-TimeZone', 'traceparent'],
}));

// Log middleware
app.use(logger());

// Request parsing middleware
app.use(bodyParser()).use(trimMiddleware());

// Exception packing middleware
app.use(exceptionMiddleware());

// Auth middleware
app.use(jwt({
  secret: jwksRsa.koaJwtSecret({
    jwksUri: `https://${config.auth.domain}/.well-known/jwks.json`,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  }),
  audience: `https://${config.auth.domain}/api/v2/`,
  issuer: `https://${config.auth.domain}/`,
}).unless({ path: [...config.auth.unless, /\/*.yaml/] }));

// Static file service
const staticCacheSrv = staticCache(path.join(__dirname, 'public'), { prefix: '/api', gzip: true });
Object.defineProperty(staticCacheSrv, 'name', { value: 'staticCache', writable: false });
app.use(staticCacheSrv);

// HTTP route
app.use(router.routes()).use(router.allowedMethods());

// Start server
app.listen(config.port, () => console.log('--- Backend server start to listen 3003 ---'));
