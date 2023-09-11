const users = [{ user_id: 'auth0:1' }, { user_id: 'auth0:2' }, { user_id: 'auth0:3' }];
const userToken = 'mock-token';
const logs = [{ timestamp: Date.now(), user_id: 'auth0:1' },
  { timestamp: Date.now(), user_id: 'auth0:1' },
  { timestamp: Date.now(), user_id: 'auth0:2' },
];

export {
  users,
  userToken,
  logs,
};
