import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import userFinancialData from "./userfinancials.js";
import bcrypt from "bcrypt";
import validation from "../validation.js";
import jwt from "jsonwebtoken";

const saltRounds = 11;


const exportedMethods = {
  async getUserById(id) {
    id = validation.checkId(id, "User Id");
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw "User not found";
    const result = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userFinancialId: user.userFinancialId,
      createdAt: user.createdAt,
    };
    return result;
  },

  async signUpUser(firstName, lastName, email, password) {
    firstName = validation.checkName(firstName, "firstName");
    lastName = validation.checkName(lastName, "lastName");
    email = validation.checkEmail(email, "email");
    password = validation.checkPassword(password);

    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hash,
      userFinancialId: null,
      createdAt: new Date(),
    };

    const userCollection = await users();

    const emailCheck = await userCollection.findOne({ email });
    if (emailCheck) throw "Email already exists";

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add user";
    const result = {
      _id: insertInfo.insertedId,
      firstName,
      lastName,
      email,
      userFinancialId: null,
      createdAt: new Date(),
    };
    return result;
  },

  async loginUser(email, password) {
    email = validation.checkEmail(email, "email");
    password = validation.checkPassword(password);

    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (!user) throw "Either the username or password is invalid";

    let match = await bcrypt.compare(password, user.password);
    if (!match) throw "Either the username or password is invalid";

    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userFinancialId: user.userFinancialId,
      createdAt: user.createdAt,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      message: "Login successful!",
      token: token,
      payload: payload,
    };
  },

  async removeUser(id) {
    id = validation.checkId(id, "User Id");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!deletionInfo) throw `Could not delete user with id of ${id}`;
    if (deletionInfo.userFinancialId) {
      await userFinancialData.removeUserFinancials(
        deletionInfo.userFinancialId
      );
    }
    return { ...deletionInfo, deleted: true };
  },
};
export default exportedMethods;
