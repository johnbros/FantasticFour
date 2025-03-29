import { ObjectId } from "mongodb";

const exportedMethods = {
  checkString(strVal, varName) {
    if (!strVal) throw `You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkPassword(strVal) {
    const varName = "Password";
    strVal = this.checkString(strVal, varName);
    if (strVal.length < 8)
      throw `the ${varName} is not at least 8 characters long`;
    // https://stackoverflow.com/questions/2370015/regular-expression-for-password-validation
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    let re =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*#?&\s])[a-zA-Z\d@$!%*#?&\s]+$/;
    if (!re.test(strVal)) {
      throw `${varName} must contain at least one uppercase and lowercase character, one number and one special character`;
    }
    return strVal;
  },

  checkId(id, valName) {
    if (!ObjectId.isValid(id)) throw `invalid ${valName} Id`;
    return id;
  },

  checkName(strVal, valName) {
    strVal = this.checkString(strVal, varName);
    if (strVal.length < 5 || strVal.length > 25)
      throw `the ${varName} ${strVal} is not between 5 and 25 characters`;
    let re = /^(?=.*[a-zA-Z])[a-zA-Z\s.'-]+$/;
    if (!re.test(strVal)) {
      throw `${varName} must only contain letters and spaces with the exception of apostrophes, hyphens, and periods`;
    }
    return strVal;
  },

  checkNum(num, valName) {
    if (!num && !(num === 0)) throw `No input for ${valName}`;
    if (!valName) throw `No name for ${num}`;
    if (num === undefined) throw `${valName} is undefined`;
    if (typeof num !== "number") throw `${valName} is not a number`;
    if (isNaN(num)) throw `${valName} is NaN`;
    if (num === Infinity) throw `${valName} is Infinity`;
    if (num < 0) throw `${valName} is a negative number`;
    if (!Number.isInteger(num)) throw `${valName} is not an integer`;
    return num;
  },

  checkRiskTolerance(riskTolerance) {
    riskTolerance = checkNum(riskTolerance, "Risk Tolerance");
    if (riskTolerance < 1 || riskTolerance > 5)
      throw `Risk tolerance is not between 1 and 5`;
    return riskTolerance;
  },

  TODO, //email validation
  checkEmail(email){},

  checkPercentage(percentage) {
    percentage = this.checkNum(percentage, "Percentage");
    if (percentage < 0 || percentage > 100)
      throw `Percentage is not between 0 and 100`;
    return percentage;
  }

};

export default exportedMethods;
