import Router from 'koa-router';
import { koaSwagger } from 'koa2-swagger-ui';
import config from '../config';

const router = new Router();

const customRequestInterceptor = (req: any) => {
  if (req.url.endsWith('/token')) {
    // TODO: Find another way to add audience to request.
    req.body += '&audience=https://khl.jp.auth0.com/api/v2/';
  }
  return req;
};

router.get('/', koaSwagger({
  routePrefix: false,
  favicon: 'favicon.ico',
  swaggerOptions: {
    ...config.swagger,
    requestInterceptor: customRequestInterceptor.toString(),
  },
  oauthOptions: {
    clientId: config.auth.clientId,
    clientSecret: config.auth.clientSecret,
  },
}), () => {});

export default router;
