import request, { server, token } from './index';
import { users, logs } from './mocks/auth0';
import { ctxUser } from './mocks/authMiddleware';

describe('User', () => {
  beforeAll(() => server.listen());

  afterAll(() => server.close());

  describe('GET /users', () => {
    it('should get user list', async () => {
      const res = await request.get('/users').set({ Authorization: token });
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(users.length);
    });
  });

  describe('PUT /users', () => {
    const data = {
      name: 'New Name', given_name: 'New', family_name: 'Name', email: 'unit_test@example.com',
    };

    it('should update user by token', async () => {
      const res = await request.put('/users').set({ Authorization: token }).send(data);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(data.name);
      expect(res.body.given_name).toBe(data.given_name);
      expect(res.body.family_name).toBe(data.family_name);
    });

    it('shouldn\'t update user if given name is not alphabetic', async () => {
      const res = await request.put('/users').set({ Authorization: token }).send({ ...data, given_name: '123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid given name: 123');
    });

    it('shouldn\'t update user if family name is not alphabetic', async () => {
      const res = await request.put('/users').set({ Authorization: token }).send({ ...data, family_name: '456' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid family name: 456');
    });

    it('shouldn\'t update user if email is invalid', async () => {
      const res = await request.put('/users').set({ Authorization: token }).send({ ...data, email: 'email address' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid email: email address');
    });
  });

  describe('DELETE /users', () => {
    it('should delete user by token', async () => {
      const res = await request.delete('/users').set({ Authorization: token });
      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });
  });

  describe('GET /users/profile', () => {
    it('should get user by token', async () => {
      const res = await request.get('/users/profile').set({ Authorization: token });
      expect(res.statusCode).toBe(200);
      expect(res.body.user_id).toBe(ctxUser.sub);
    });
  });

  describe('POST /users/verify-email', () => {
    it('should send verification email to user by token', async () => {
      const res = await request.post('/users/verify-email').set({ Authorization: token });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({});
    });
  });

  describe('POST /users/change-password', () => {
    const data = {
      old_password: 'Old_passw0rd',
      new_password: 'New_passw0rd',
      confirm_password: 'New_passw0rd',
    };

    it('should send password change notification email to user by token', async () => {
      const res = await request.post('/users/change-password').set({ Authorization: token }).send(data);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({});
    });

    it('shouldn\'t send password change notification email to user if old password is invalid', async () => {
      const res = await request.post('/users/change-password').set({ Authorization: token }).send({ ...data, old_password: 'o' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid old password');
    });

    it('shouldn\'t send password change notification email to user if new password is invalid', async () => {
      const res = await request.post('/users/change-password').set({ Authorization: token }).send({ ...data, new_password: 'n' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid new password');
    });

    it('shouldn\'t send password change notification email to user if confirm password is invalid', async () => {
      const res = await request.post('/users/change-password').set({ Authorization: token }).send({ ...data, confirm_password: 'c' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid confirm password');
    });
  });

  describe('GET /users/stats', () => {
    const data = { types: ['s'], start_timestamp: Date.now() - 3600000, end_timestamp: Date.now() };

    it('should get user statistics by types and time range', async () => {
      const res = await request.get('/users/stats').set({ Authorization: token }).query(data);
      console.log('QQ: res=', res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.counts[res.body.counts.length - 1]).toBe(logs.length);
      expect(res.body.users[res.body.users.length - 1]).toBe(logs.reduce((arr: string[], log: any) => {
        if (!arr.includes(log.user_id)) arr.push(log.user_id);
        return arr;
      }, []).length);
    });

    it('shouldn\'t get user statistics if types is wrong', async () => {
      const res = await request.get('/users/stats').set({ Authorization: token }).query({ ...data, types: [''] });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid types: ');
    });

    it('shouldn\'t get user statistics if start timestamp is wrong', async () => {
      const res = await request.get('/users/stats').set({ Authorization: token }).query({ ...data, start_timestamp: 'one' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid start timestamp: one');
    });

    it('shouldn\'t get user statistics if end timestamp is wrong', async () => {
      const res = await request.get('/users/stats').set({ Authorization: token }).query({ ...data, end_timestamp: 'two' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid end timestamp: two');
    });

    it('shouldn\'t get user statistics if time range is wrong', async () => {
      const ts = Date.now() + 1;
      const res = await request.get('/users/stats').set({ Authorization: token }).query({ ...data, start_timestamp: ts });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(`Invalid time range: ${ts}, ${data.end_timestamp}`);
    });
  });
});
