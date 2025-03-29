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
        let re = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*#?&\s])[a-zA-Z\d@$!%*#?&\s]+$/;
        if (!re.test(strVal)) {
            throw `${varName} must contain at least one uppercase and lowercase character, one number and one special character`;
        }
        return strVal;
    },

    checkId(id, valName) {
        // id = this.checkString(id, "Id");
        if (!ObjectId.isValid(id)) throw `invalid ${valName} Id`;
        return id;
    },
}