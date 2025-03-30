import { ObjectId } from "mongodb";
import { investments, users } from "../config/mongoCollections.js";
import investmentData from "./investments.js";
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
      riskTolerance: user.riskTolerance,
      investments: user.investments,
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
      riskTolerance: null,
      investments: [],
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
      riskTolerance: null,
      investments: [],
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
      riskTolerance: user.riskTolerance,
      investments: user.investments,
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

  async updateUser(id, updatedUser) {
    id = validation.checkId(id, "User");
    const updatedUserData = {};
    if (updatedUser.firstName)
      updatedUserData.firstName = validation.checkName(
        updatedUser.firstName,
        "firstName"
      );
    if (updatedUser.lastName)
      updatedUserData.lastName = validation.checkName(
        updatedUser.lastName,
        "lastName"
      );
    if (updatedUser.email)
      updatedUserData.email = validation.checkEmail(
        updatedUser.email,
        "email"
      );
    if (updatedUser.password) {
        updatedUserData.password = validation.checkPassword(
            updatedUser.password,
            "password"
        );
        const hash = await bcrypt.hash(updatedUserData.password, saltRounds);
        updatedUserData.password = hash;
        }
    if (updatedUser.riskTolerance) {
      updatedUserData.riskTolerance = validation.checkRiskTolerance(
        updatedUser.riskTolerance,
        "risk tolerance"
      );
    }
    

    const userCollection = await users();
    const updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedUserData },
      { returnDocument: "after" }

    );

    if (!updatedInfo) throw "Could not update user successfully";
    const result = {
      _id: updatedInfo._id,
      firstName: updatedInfo.firstName,
      lastName: updatedInfo.lastName,
      email: updatedInfo.email,
      riskTolerance: updatedInfo.riskTolerance,
      investments: updatedInfo.investments,
      createdAt: updatedInfo.createdAt,
    };
    return result;
  },

  async removeUser(id) {
    id = validation.checkId(id, "User Id");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!deletionInfo) throw `Could not delete user with id of ${id}`;
    for (const investmentId of deletionInfo.investments) {
      await investmentData.removeInvestment(investmentId);
    }
    return { ...deletionInfo, deleted: true };
  },

  async totalInvestment(userId) {
    const user = await this.getUserById(userId);
    if (user.investments.length === 0) return 0;
    const investmentCollection = await investments();
    let totalValue = 0;
    for (const investmentId of user.investments) {
      const investment = await investmentCollection.findOne({
        _id: new ObjectId(investmentId),
      });
      if (!investment) throw "Investment not found";
      const value = await investmentData.totalSubInvestment(investmentId);
      totalValue += value;
    }
    return totalValue;
  },
};
export default exportedMethods;
