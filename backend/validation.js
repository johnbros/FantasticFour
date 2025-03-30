import { ObjectId } from "mongodb";
import { users } from "./config/mongoCollections.js";

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

  checkConfirmPassword(password, confirmPassword) {
    // Validate if the confirm password matches the password
    if (!confirmPassword) throw "Confirm Password is required!";
    if (password !== confirmPassword)
      throw "Password and Confirm Password do not match!";
    return confirmPassword;
  },
  

  checkId(id, valName) {
    if (!ObjectId.isValid(id)) throw `invalid ${valName} Id`;
    return id;
  },

  checkName(strVal, valName) {
    strVal = this.checkString(strVal, valName);
    if (strVal.length < 2 || strVal.length > 25)
      throw `the ${valName} ${strVal} is not between 2 and 25 characters`;
    let re = /^(?=.*[a-zA-Z])[a-zA-Z\s.'-]+$/;
    if (!re.test(strVal)) {
      throw `${valName} must only contain letters and spaces with the exception of apostrophes, hyphens, and periods`;
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

  //TODO, //email validation
  checkEmail(email){
    if (!email) throw `Email is required`;

    if (typeof email !== "string" || email.trim() === "")
      throw `Email must be a string and not empty`;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw `Invalid email address`;

    return email;
  },

  checkPercentage(percentage) {
    percentage = this.checkNum(percentage, "Percentage");
    if (percentage < 0 || percentage > 100)
      throw `Percentage is not between 0 and 100`;
    return percentage;
},

  async checkForDuplicateEmail(email) {
    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (user) throw `Email already in use`;
    return email;
  }

};

export default exportedMethods;
