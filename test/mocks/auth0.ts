import { DateTime } from 'luxon';

const users = [{ user_id: 'auth0:1' }, { user_id: 'auth0:2' }, { user_id: 'auth0:3' }];
const userToken = 'mock-token';
const logs = [{ date: DateTime.now().toISO(), user_id: 'auth0:1' },
  { date: DateTime.now().toISO(), user_id: 'auth0:1' },
  { date: DateTime.now().toISO(), user_id: 'auth0:2' },
];

export {
  users,
  userToken,
  logs,
};
