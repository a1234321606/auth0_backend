/**
 * Check the string is integer or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isInteger = (str: string) => (str ? Number.isInteger(Number(str)) : false);

/**
 * Check the string is number or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isNumber = (str: string) => (str ? !Number.isNaN(Number(str)) : false);

/**
 * Check the parameter is empty object or not
 * @param {*} obj - (object) the object to be verified
 * @returns Boolean
 */
function isEmptyObj(obj: any) {
  try {
    return obj.constructor === Object && Object.keys(obj).length === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Check the string is latitude or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isLatitude = (str: string) => {
  try {
    const num = Number(str);
    return num >= -90 && num <= 90;
  } catch (error) {
    console.error(error);
  }
  return false;
};

/**
 * Check the string is longitude or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isLongitude = (str: string) => {
  try {
    const num = Number(str);
    return num >= -180 && num <= 180;
  } catch (error) {
    console.error(error);
  }
  return false;
};

/**
 * Check the string is MAC address or not.
 * Allow XX-XX-XX-XX-XX-XX or XX:XX:XX:XX:XX:XX
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isMacAddress = (str: string) => /^(([0-9A-Fa-f]{2}:){5}|([0-9A-Fa-f]{2}-){5})([0-9A-Fa-f]{2})$/.test(str);

/**
 * Check the string is email or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
// eslint-disable-next-line no-useless-escape
const isEmail = (str: string) => /^[\w.+-]+@([a-zA-Z\d-]+\.)+[a-zA-Z\d-]{2,4}$/.test(str);

/**
 * Check the string is alphabetic or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
// eslint-disable-next-line no-useless-escape
const isAlphabetic = (str: string) => !/[\d`~!@#$%^&*()\-_=+[\]{}\\|;:'"<>,.?\/]/.test(str);

/**
 * Check the string is valid password or not. Password must contain:
 * • At least 8 characters
 * • At least 3 of the following:
 *   • Lower case letters (a-z)
 *   • Upper case letters (A-Z)
 *   • Numbers (0-9)
 *   • Special characters (e.g. !@#$%^&*`~)
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isPasswordValid = (str: string) => {
  const isLengthValid = str.length > 7;
  const isLowerCase = /[a-z]/.test(str);
  const isUpperCase = /[A-Z]/.test(str);
  const isDigit = /\d/.test(str);
  const isSpecialChar = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?`~]+/.test(str);
  return isLengthValid && (+isLowerCase + +isUpperCase + +isDigit + +isSpecialChar > 2);
};

export default {
  isInteger,
  isNumber,
  isEmptyObj,
  isLatitude,
  isLongitude,
  isMacAddress,
  isEmail,
  isAlphabetic,
  isPasswordValid,
};
