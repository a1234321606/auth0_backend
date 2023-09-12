import { DateTime } from 'luxon';
import { ArgumentException } from '../utilities/responser/exceptions';
import auth0 from '../api/auth0';
import mailer from '../utilities/mailer';
import userRepo from '../repositories/user';

const format = (user: any) => ({
  user_id: user.user_id,
  name: user.user_metadata?.name || user.name,
  given_name: user.given_name,
  family_name: user.family_name,
  email: user.email,
  logins_count: user.logins_count,
  last_login: user.user_metadata?.last_login,
  created_at: user.created_at,
});

const getUsers = async () => Promise.all((await auth0.getUsers()).map(async (u: any) => format(u)));

const getUserById = async (id: string) => format(await auth0.getUserById(id));

const updateUserById = async (user: any, id: string) => format(await auth0.updateUserById(user, id));

const deleteUserById = async (id: string, email: string, username: string) => {
  await auth0.deleteUserById(id);
  if (id.startsWith('auth0')) mailer.sendAccountDeleteMail([email], username);
};

const verifyEmail = (id: string) => auth0.sendEmailVerifyRequest(id);

const changePassword = async (passwordData: any, id: string, email: string, username: string) => {
  let token;
  try {
    token = await auth0.getUserToken(email, passwordData.old_password);
  } catch (e) {
    throw new ArgumentException('Invalid old password');
  }
  if (token) {
    const user = { password: passwordData.new_password, connection: 'Username-Password-Authentication' };
    await auth0.updateUserById(user, id);

    mailer.sendPasswordChangeMail([email], username);
  }
};

const getStatistics = async (startTimestamp: number, endTimestamp: number, zone: string) => {
  const conditions = ['$1 <= timestamp', 'timestamp <= $2'];
  const data = [startTimestamp, endTimestamp];
  const logs = await userRepo.getSessionLogs(conditions, data);

  let cur = DateTime.fromMillis(startTimestamp, { zone });
  const end = DateTime.fromMillis(endTimestamp, { zone });
  const result: any = { time: [], counts: [], users: [] };
  const tmp = { count: 0, users: new Set() };
  for (let i = 0; i <= logs.length;) {
    // NOTE: Cannot use continue because of "unexpected use of continue statement. eslint(no-continue)"
    let isContinue = false;
    if (logs[i]) {
      const time = DateTime.fromMillis(logs[i].timestamp, { zone });
      if (cur.toFormat('yyyy-MM-dd') === time.toFormat('yyyy-MM-dd')) {
        tmp.count += 1;
        tmp.users.add(logs[i].user_id);
        i += 1;
        isContinue = true;
      }
    }
    if (!isContinue) {
      result.time.push(cur.toFormat('yyyy-MM-dd'));
      result.counts.push(tmp.count);
      result.users.push(tmp.users.size);
      tmp.count = 0;
      tmp.users.clear();
      cur = cur.plus({ day: 1 });
      if (!logs[i] && cur > end) break;
    }
  }
  return result;
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
