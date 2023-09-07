import {
  AuthFailException, ForbiddenException, UnauthException, ServerException,
} from '../src/utilities/responser/exceptions';

describe('Responser Exception', () => {
  describe('UnauthException', () => {
    it('should throw UnauthException', async () => {
      const e = new UnauthException('Unit Test');
      expect(e.name).toBe('Unauth Exception');
      expect(e.message).toBe('Unit Test');
      expect(e.status).toBe(401);
    });
  });

  describe('ForbiddenException', () => {
    it('should throw ForbiddenException', async () => {
      const e = new ForbiddenException('Unit Test');
      expect(e.name).toBe('Authorization Exception');
      expect(e.message).toBe('Unit Test');
      expect(e.status).toBe(403);
    });
  });

  describe('AuthFailException', () => {
    it('should throw AuthFailException', async () => {
      const e = new AuthFailException('Unit Test');
      expect(e.name).toBe('Auth Fail Exception');
      expect(e.message).toBe('Unit Test');
      expect(e.status).toBe(412);
    });
  });

  describe('ServerException', () => {
    it('should throw ServerException', async () => {
      const e = new ServerException('Unit Test');
      expect(e.name).toBe('Server Exception');
      expect(e.message).toBe('Unit Test');
      expect(e.status).toBe(500);
    });
  });
});
