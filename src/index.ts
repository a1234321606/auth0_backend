import Koa from 'koa';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import staticCache from 'koa-static-cache';
import path from 'path';
import bodyParser from 'koa-body';
import config from './config';
import router from './routers';
import trimMiddleware from './middlewares/trimMiddleware';
import exceptionMiddleware from './middlewares/exceptionMiddleware';
import authMiddleware from './middlewares/authMiddleware';

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
app.use(authMiddleware());

// Static file service
const staticCacheSrv = staticCache(path.join(__dirname, 'public'), { prefix: '/api', gzip: true });
Object.defineProperty(staticCacheSrv, 'name', { value: 'staticCache', writable: false });
app.use(staticCacheSrv);

// HTTP route
app.use(router.routes()).use(router.allowedMethods());

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => console.log(`--- Backend server start to listen ${config.port} ---`));
}
export default app;
