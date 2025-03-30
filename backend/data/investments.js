import { ObjectId } from "mongodb";
import {
  investments,
  subInvestments,
  users,
} from "../config/mongoCollections.js";
import subInvestmentData from "./subInvestments.js";
import validation from "../validation.js";

const exportedMethods = {
  async getInvestmentById(id) {
    id = validation.checkId(id, "Investment Id");
    const investmentCollection = await investments();
    const investment = await investmentCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!investment) throw "Investment not found";
    return investment;
  },

  async addInvestment(userId, investmentType) {
    userId = validation.checkId(userId, "user");
    investmentType = validation.checkString(investmentType, "investment type");

    const newInvestment = {
      userId,
      investmentType,
      dateInvested: new Date(),
      subInvestments: [],
    };

    const investmentCollection = await investments();
    const insertInfo = await investmentCollection.insertOne(newInvestment);
    const newId = insertInfo.insertedId;
    const userCollection = await users();
    await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { investments: insertInfo.insertedId } },
      { returnDocument: "after" }
    );
    return await this.getInvestmentById(newId);
  },

  async updateInvestment(id, updatedInvestment) {
    id = validation.checkId(id);
    updatedInvestmentData = {};
    if (updatedInvestment.investmentType)
      updatedInvestmentData.investmentType = validation.checkString(
        updatedInvestment.investmentType
      );

    const investmentCollection = await investments();
    let newInvestment = await investmentCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedInvestmentData },
      { returnDocument: "after" }
    );
    if (!newInvestment) throw "Could not update investment";
  },

  async removeInvestment(id) {
    const investmentCollection = await investments();
    const deletionInfo = await investmentCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!deletionInfo) throw `Could not delete investment with id of ${id}`;
    for (const subInvestmentId of deletionInfo.subInvestments) {
      await subInvestmentData.removeSubInvestment(subInvestmentId);
    }
    const userCollection = await users();
    const checkUser = await userCollection.findOne({
      _id: new ObjectId(deletionInfo.userId),
    });
    if (checkUser) {
      await userCollection.findOneAndUpdate(
        { _id: new ObjectId(deletionInfo.userId) },
        { $pull: { investments: deletionInfo._id } },
        { returnDocument: "after" }
      );
    }
    
    return { ...deletionInfo, deleted: true };
  },

  async totalSubInvestment(investmentId) {
    investmentId = validation.checkId(investmentId, "investment Id");
    const investmentCollection = await investments();
    const investment = await investmentCollection.findOne({
      _id: new ObjectId(investmentId),
    });
    if (!investment) throw "Investment not found";
    const subInvestmentCollection = await subInvestments();
    let value = 0;
    for (const subInvestmentId of investment.subInvestments) {
      const subInvestment = await subInvestmentCollection.findOne({
        _id: new ObjectId(subInvestmentId),
      });
      if (!subInvestment) throw "Sub investment not found";
      value += subInvestment.value;
    }
    return value;
  },
};

export default exportedMethods;
