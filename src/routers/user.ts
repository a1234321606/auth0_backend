import Router, { IRouterContext } from 'koa-router';
import userController from '../controllers/user';

const router = new Router();

router.get('/', async (ctx: IRouterContext) => userController.getUsers(ctx));

router.put('/', async (ctx: IRouterContext) => userController.updateUserById(ctx));

router.delete('/', async (ctx: IRouterContext) => userController.deleteUserById(ctx));

router.get('/profile', async (ctx: IRouterContext) => userController.getUserById(ctx));

router.post('/verify-email', async (ctx: IRouterContext) => userController.verifyEmail(ctx));

router.post('/change-password', async (ctx: IRouterContext) => userController.changePassword(ctx));

router.get('/stats', async (ctx: IRouterContext) => userController.getStatistics(ctx));

export default router;
