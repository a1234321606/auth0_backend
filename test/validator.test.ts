import validator from '../src/utilities/validator';

describe('Validator', () => {
  describe('isInteger', () => {
    it('should be passed if value is integer', async () => {
      expect(validator.isInteger('123')).toBe(true);
      expect(validator.isInteger('+123')).toBe(true);
      expect(validator.isInteger('-123')).toBe(true);
    });

    it('shouldn\'t be passed if value is not integer', async () => {
      expect(validator.isInteger('one')).toBe(false);
      expect(validator.isInteger('456+')).toBe(false);
      expect(validator.isInteger('456-')).toBe(false);
      expect(validator.isInteger('')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should be passed if value is number', async () => {
      expect(validator.isNumber('314')).toBe(true);
      expect(validator.isNumber('+314')).toBe(true);
      expect(validator.isNumber('-3.14')).toBe(true);
      expect(validator.isNumber('3.')).toBe(true);
    });

    it('shouldn\'t be passed if value is not number', async () => {
      expect(validator.isInteger('one')).toBe(false);
      expect(validator.isInteger('314+')).toBe(false);
      expect(validator.isInteger('3.14-')).toBe(false);
      expect(validator.isInteger('.3')).toBe(false);
      expect(validator.isInteger('')).toBe(false);
    });
  });

  describe('isEmptyObj', () => {
    it('should be passed if value has any properties', async () => {
      expect(validator.isEmptyObj({ property: 'value' })).toBe(false);
      expect(validator.isEmptyObj({ property: null })).toBe(false);
      expect(validator.isEmptyObj({ property: undefined })).toBe(false);
      expect(validator.isEmptyObj('')).toBe(false);
      expect(validator.isEmptyObj(null)).toBe(false);
      expect(validator.isEmptyObj(undefined)).toBe(false);
      expect(validator.isEmptyObj(0)).toBe(false);
      expect(validator.isEmptyObj(false)).toBe(false);
    });

    it('shouldn\'t be passed if value doesn\'t have any properties', async () => {
      expect(validator.isEmptyObj({})).toBe(true);
    });
  });

  describe('isLatitude', () => {
    it('should be passed if value is latitude', async () => {
      expect(validator.isLatitude('23')).toBe(true);
      expect(validator.isLatitude('+23')).toBe(true);
      expect(validator.isLatitude('-23')).toBe(true);
      expect(validator.isLatitude('23.')).toBe(true);
    });

    it('shouldn\'t be passed if value is not latitude', async () => {
      expect(validator.isLatitude('91')).toBe(false);
      expect(validator.isLatitude('90.1')).toBe(false);
      expect(validator.isLatitude('+91')).toBe(false);
      expect(validator.isLatitude('-91')).toBe(false);
      expect(validator.isLatitude('nine')).toBe(false);
      expect(validator.isLatitude('.')).toBe(false);
    });
  });

  describe('isLongitude', () => {
    it('should be passed if value is longitude', async () => {
      expect(validator.isLongitude('121')).toBe(true);
      expect(validator.isLongitude('+121')).toBe(true);
      expect(validator.isLongitude('-121')).toBe(true);
      expect(validator.isLongitude('121.')).toBe(true);
    });

    it('shouldn\'t be passed if value is not longitude', async () => {
      expect(validator.isLongitude('181')).toBe(false);
      expect(validator.isLongitude('180.1')).toBe(false);
      expect(validator.isLongitude('+181')).toBe(false);
      expect(validator.isLongitude('-181')).toBe(false);
      expect(validator.isLongitude('one')).toBe(false);
      expect(validator.isLongitude('.')).toBe(false);
    });
  });

  describe('isMacAddress', () => {
    it('should be passed if value is MAC address', async () => {
      expect(validator.isMacAddress('aa-bb-cc-dd-ee-ff')).toBe(true);
      expect(validator.isMacAddress('AA-BB-CC-DD-EE-FF')).toBe(true);
      expect(validator.isMacAddress('45-67-89-ab-cD-EF')).toBe(true);
      expect(validator.isMacAddress('12:34:56:78:90:ab')).toBe(true);
    });

    it('shouldn\'t be passed if value is not MAC address', async () => {
      expect(validator.isMacAddress('1234567890')).toBe(false);
      expect(validator.isMacAddress('bb-cc-dd-ee-ff-gg')).toBe(false);
      expect(validator.isMacAddress('56:78:9A:BC:DE:FG')).toBe(false);
      expect(validator.isMacAddress('AA:BB:CC-DD-EE-FF')).toBe(false);
    });
  });

  describe('isEmail', () => {
    it('should be passed if value is Email', async () => {
      expect(validator.isEmail('a@b.cd')).toBe(true);
      expect(validator.isEmail('a@b.cdef')).toBe(true);
      expect(validator.isEmail('A.B-C_D+E@b.cdef')).toBe(true);
    });

    it('shouldn\'t be passed if value is not Email', async () => {
      expect(validator.isEmail('')).toBe(false);
      expect(validator.isEmail('a')).toBe(false);
      expect(validator.isEmail('a@')).toBe(false);
      expect(validator.isEmail('a@b')).toBe(false);
      expect(validator.isEmail('a@b.c')).toBe(false);
      expect(validator.isEmail('a@b.cdefg')).toBe(false);
      expect(validator.isEmail('d@@b.cdef')).toBe(false);
    });
  });

  describe('isAlphabetic', () => {
    it('should be passed if valueh is alphabetic', async () => {
      expect(validator.isAlphabetic('A')).toBe(true);
      expect(validator.isAlphabetic('abc')).toBe(true);
      expect(validator.isAlphabetic('中文')).toBe(true);
      expect(validator.isAlphabetic('')).toBe(true);
    });

    it('shouldn\'t be passed if value is not alphabetic', async () => {
      expect(validator.isAlphabetic('`')).toBe(false);
      expect(validator.isAlphabetic('~')).toBe(false);
      expect(validator.isAlphabetic('!')).toBe(false);
      expect(validator.isAlphabetic('@')).toBe(false);
      expect(validator.isAlphabetic('#')).toBe(false);
      expect(validator.isAlphabetic('$')).toBe(false);
      expect(validator.isAlphabetic('%')).toBe(false);
      expect(validator.isAlphabetic('^')).toBe(false);
      expect(validator.isAlphabetic('&')).toBe(false);
      expect(validator.isAlphabetic('*')).toBe(false);
      expect(validator.isAlphabetic('(')).toBe(false);
      expect(validator.isAlphabetic(')')).toBe(false);
      expect(validator.isAlphabetic('_')).toBe(false);
      expect(validator.isAlphabetic('_')).toBe(false);
      expect(validator.isAlphabetic('+')).toBe(false);
      expect(validator.isAlphabetic('=')).toBe(false);
      expect(validator.isAlphabetic('{')).toBe(false);
      expect(validator.isAlphabetic('[')).toBe(false);
      expect(validator.isAlphabetic('}')).toBe(false);
      expect(validator.isAlphabetic(']')).toBe(false);
      expect(validator.isAlphabetic('|')).toBe(false);
      expect(validator.isAlphabetic('\\')).toBe(false);
      expect(validator.isAlphabetic(']')).toBe(false);
      expect(validator.isAlphabetic('|')).toBe(false);
      expect(validator.isAlphabetic(':')).toBe(false);
      expect(validator.isAlphabetic(';')).toBe(false);
      expect(validator.isAlphabetic('"')).toBe(false);
      expect(validator.isAlphabetic('\'')).toBe(false);
      expect(validator.isAlphabetic('<')).toBe(false);
      expect(validator.isAlphabetic(',')).toBe(false);
      expect(validator.isAlphabetic('>')).toBe(false);
      expect(validator.isAlphabetic('.')).toBe(false);
      expect(validator.isAlphabetic('?')).toBe(false);
      expect(validator.isAlphabetic('/')).toBe(false);
    });
  });

  describe('isPasswordValid', () => {
    it('should be passed if value has valid password policy', async () => {
      expect(validator.isPasswordValid('P@ssword')).toBe(true);
      expect(validator.isPasswordValid('Passw0rd')).toBe(true);
      expect(validator.isPasswordValid('p@ssw0rd')).toBe(true);
    });

    it('shouldn\'t be passed if value doesn\'t have valid password policy', async () => {
      expect(validator.isPasswordValid('p@ssw0r')).toBe(false);
      expect(validator.isPasswordValid('Password')).toBe(false);
      expect(validator.isPasswordValid('p@ssword')).toBe(false);
      expect(validator.isPasswordValid('passw0rd')).toBe(false);
    });
  });
});
