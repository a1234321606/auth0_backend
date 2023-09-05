/**
 * Check the string is integer or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isInteger = (str: string) => {
  try {
    if (str) return Number.isInteger(Number(str));
  } catch (error) {
    console.error(error);
  }
  return false;
};

/**
 * Check the string is number or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isNumber = (str: string) => !Number.isNaN(str);

/**
 * Check the parameter is object or not
 * @param {*} obj - (object) the object to be verified
 * @returns Boolean
 */
function isEmptyObj(obj: any) {
  try {
    return Object.keys(obj).length === 0;
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
 * Check the string is MAC address or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isMacAddress = (str: string) => /^([a-fA-F\d]{2}:){5}[a-fA-F\d]{2}$/.test(str);

/**
 * Check the string is email or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

/**
 * Check the string is phone number or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isPhoneNumber = (str: string) => /^(\+?\d{1,3})?[ -]?\d{3,}[- ]?\d{4,}$/.test(str);

/**
 * Check the string is alphabetic or not
 * @param {*} str - (String) the string to be verified
 * @returns Boolean
 */
const isAlphabetic = (str: string) => !/[0-9!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(str);

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
  isPhoneNumber,
  isAlphabetic,
  isPasswordValid,
};
