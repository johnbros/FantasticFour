import { ObjectId } from "mongodb";
import {
  investments,
  subInvestments,
  userFinancials,
} from "../config/mongoCollections.js";
import subInvestmentData from "./subInvestments.js";
import validation from "../validation.js";

const exportedMethods = {
  async getInvestmentById(id) {
    console.log(id);
    id = validation.checkId(id, "Investment Id");
    const investmentCollection = await investments();
    const investment = await investmentCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!investment) throw "Investment not found";
    return investment;
  },

  async addInvestment(userId, userFinancialId, investmentType) {
    userId = validation.checkId(userId, "User Id");
    userFinancialId = validation.checkId(userFinancialId, "Financial Id");
    investmentType = validation.checkString(investmentType, "investment type");
    // TODO; // dateInvested = validation.checkDateInvested(dateInvested)

    const newInvestment = {
      userId,
      investmentType,
      value: 0,
      subInvestments: [],
    };

    const investmentCollection = await investments();
    const insertInfo = await investmentCollection.insertOne(newInvestment);
    const newId = insertInfo.insertedId;
    const userFinancialsCollection = await userFinancials();
    const updatedFinancials = await userFinancialsCollection.findOneAndUpdate(
      { _id: new ObjectId(userFinancialId) },
      { $push: { investments: newId} },
      { returnDocument: "after" }
    );
    return await this.getInvestmentById(newId);
  },

  async updateInvestment(id, updatedInvestment) {
    id = validation.checkId(id);
    updatedInvestmentData = {};
    if (updatedInvestment.investmentName)
      updatedInvestmentData.investmentName = validation.checkString(
        updatedInvestment.investmentName
      );
    if (updatedInvestment.investmentType)
      updatedInvestmentData.investmentType = validation.checkString(
        updatedInvestment.investmentType
      );
    if (updatedInvestment.value)
      updatedInvestmentData.value = validation.checkNum(
        updatedInvestment.value
      );
    if (updatedInvestment.dateInvested) TODO; //implement checkDateInvested in validation.js
    updatedInvestmentData.dateInvested = validation.checkDateInvested(
      updatedInvestment.dateInvested
    );

    const investmentCollection = await investments();
    let newInvestment = await investmentCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
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
    if (!deletionInfo) throw `Could not delete post with id of ${id}`;
    deletionInfo.subInvestments.forEach((subInvestmentId) => {
      subInvestmentData.removeSubInvestment(subInvestmentId);
    });
    const userFinancialsCollection = await userFinancials();
    await userFinancialsCollection.findOneAndUpdate(
      { _id: new ObjectId(deletionInfo.userFinId) },
      { $pull: { investments: deletionInfo._id } },
      { returnDocument: "after" }
    );
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
