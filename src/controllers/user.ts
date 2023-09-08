import { IRouterContext } from 'koa-router';
import { ArgumentException } from '../utilities/responser/exceptions';
import responser from '../utilities/responser';
import userService from '../services/user';
import validator from '../utilities/validator';

interface IUser {
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  email?: string
}

interface IUserReq extends IUser {
  user_metadata?: any
}

interface IUserRes extends IUser {
  user_id?: string
  logins_count?: number
  last_login?: string
  create_at?: string
}

interface IPassword {
  new_password: string
  old_password: string
  confirm_password: string
}

interface IQuery {
  types: string[]
  start_timestamp: number
  end_timestamp: number
}

const verifyUser = (data: IUser) => {
  const user: IUserReq = {};
  if (data.name != null) {
    if (!user.user_metadata) user.user_metadata = {};
    user.user_metadata.name = data.name === '' ? null : data.name;
  }
  if (data.given_name != null) {
    if (!validator.isAlphabetic(data.given_name)) throw new ArgumentException(`Invalid given name: ${data.given_name}`);
    user.given_name = data.given_name === '' ? null : data.given_name;
  }
  if (data.family_name != null) {
    if (!validator.isAlphabetic(data.family_name)) throw new ArgumentException(`Invalid family name: ${data.family_name}`);
    user.family_name = data.family_name === '' ? null : data.family_name;
  }
  if (data.email) {
    if (!validator.isEmail(data.email)) throw new ArgumentException(`Invalid email: ${data.email}`);
  }
  if (!Object.keys(user).length) throw new ArgumentException('Invalid body parameter');
  return user;
};

const verifyPassword = (data: IPassword) => {
  if (!validator.isPasswordValid(data.old_password)) throw new ArgumentException('Invalid old password');
  if (!validator.isPasswordValid(data.new_password)) throw new ArgumentException('Invalid new password');
  if (!validator.isPasswordValid(data.confirm_password)) throw new ArgumentException('Invalid confirm password');
  if (data.new_password !== data.confirm_password) throw new ArgumentException('New passwords do not match');
};

const verifyStatisticsQuery = (data: IQuery) => {
  if (!data.types.length || data.types.some((t) => !t)) throw new ArgumentException(`Invalid types: ${data.types}`);
  if (!validator.isInteger(`${data.start_timestamp}`)) throw new ArgumentException(`Invalid start timestamp: ${data.start_timestamp}`);
  if (!validator.isInteger(`${data.end_timestamp}`)) throw new ArgumentException(`Invalid end timestamp: ${data.end_timestamp}`);
  if (data.start_timestamp > data.end_timestamp) throw new ArgumentException(`Invalid time range: ${data.start_timestamp}, ${data.end_timestamp}`);
};

const getUsers = async (ctx: IRouterContext) => {
  const data: IUserRes[] = await userService.getUsers();
  responser.finalize(ctx, 200, data);
};

const getUserById = async (ctx: IRouterContext) => {
  const { sub } = ctx.state.user;
  const data: IUserRes = await userService.getUserById(sub);
  responser.finalize(ctx, 200, data);
};

const getStatistics = async (ctx: IRouterContext) => {
  const tz = ctx.get('x-timezone') || 'UTC+8';
  const { query }: any = ctx.request;
  if (!Array.isArray(query.types)) query.types = [query.types];
  verifyStatisticsQuery(query);
  const data: any = await userService.getStatistics(query.types, +query.start_timestamp, +query.end_timestamp, tz);
  responser.finalize(ctx, 200, data);
};

const updateUserById = async (ctx: IRouterContext) => {
  const { sub } = ctx.state.user;
  const { body } = ctx.request;
  const data: IUserRes = await userService.updateUserById(verifyUser(body), sub);
  responser.finalize(ctx, 200, data);
};

const deleteUserById = async (ctx: IRouterContext) => {
  const { sub } = ctx.state.user;
  const email = ctx.state.user['https://custom.claim/email'];
  const name = ctx.state.user['https://custom.claim/name'];
  await userService.deleteUserById(sub, email, name);
  responser.finalize(ctx, 204);
};

const verifyEmail = async (ctx: IRouterContext) => {
  const { sub } = ctx.state.user;
  await userService.verifyEmail(sub);
  responser.finalize(ctx, 200);
};

const changePassword = async (ctx: IRouterContext) => {
  const { body } = ctx.request;
  const { sub } = ctx.state.user;
  const email = ctx.state.user['https://custom.claim/email'];
  const name = ctx.state.user['https://custom.claim/name'];
  verifyPassword(body);
  await userService.changePassword(body, sub, email, name);
  responser.finalize(ctx, 200);
};

export default {
  getUsers,
  getUserById,
  getStatistics,
  updateUserById,
  deleteUserById,
  verifyEmail,
  changePassword,
};
