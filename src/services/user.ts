import { DateTime } from 'luxon';
import { ArgumentException } from '../utilities/responser/exceptions';
import auth0 from '../api/auth0';
import mailer from '../utilities/mailer';

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

const getStatistics = async (types: string[], startTimestamp: number, endTimestamp: number, zone: string) => {
  const codes: string = types.map((t) => `type:${t}`).join(' or ');
  let dates: string | undefined;
  if (startTimestamp && endTimestamp) {
    const startTime: string = DateTime.fromMillis(startTimestamp).toUTC().toFormat('yyyy-MM-dd HH:mm:ss');
    const endTime: string = DateTime.fromMillis(endTimestamp).toUTC().toFormat('yyyy-MM-dd HH:mm:ss');
    dates = `date:[${startTime} TO ${endTime}]`;
  }

  // NOTE: Cannot use fetchLogs in while loop because of "unexpected `await` inside a loop. eslint(no-await-in-loop)"
  const fetchLogs = async (page: number = 0) => {
    const data = await auth0.getLogs({
      q: `(${codes})${dates && ` AND ${dates}`}`,
      include_totals: true,
      fields: 'user_id,user_name,type,date',
      sort: 'date:1',
      per_page: 100,
      page,
    });
    if (data.length === data.limit) data.push(...(await fetchLogs(page + 1)));
    return data;
  };
  const data = await fetchLogs();

  let cur = DateTime.fromMillis(startTimestamp, { zone });
  let count = 0;
  const users = new Set();
  const result: any = {
    time: [],
    counts: [],
    users: [],
  };
  for (let i = 0; i <= data.logs.length;) {
    // NOTE: Cannot use continue because of "unexpected use of continue statement. eslint(no-continue)"
    let isContinue = false;
    if (data.logs[i]) {
      const time = DateTime.fromISO(data.logs[i].date, { zone });
      if (cur.toFormat('yyyy-MM-dd') === time.toFormat('yyyy-MM-dd')) {
        count += 1;
        users.add(data.logs[i].user_id);
        i += 1;
        isContinue = true;
      }
    }
    if (!isContinue) {
      result.time.push(cur.toFormat('yyyy-MM-dd'));
      result.counts.push(count);
      result.users.push(users.size);
      count = 0;
      users.clear();
      if (!data.logs[i]) break;
      cur = cur.plus({ day: 1 });
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
