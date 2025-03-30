import { ObjectId } from "mongodb";
import { investments, subInvestments } from "../config/mongoCollections.js";
import userFinancial from "./userfinancials.js";

const exportedMethods = {
  async getInvestmentById(id) {
    id = validation.checkId(id, "Investment Id");
    const investmentCollection = await investments();
    const investment = await investmentCollection.findOne({
      _id: ObjectId(id),
    });
    if (!investment) throw "Investment not found";
    return investment;
  },

  async addInvestment(userId, investmentType) {
    userId = validation.checkId(userId);
    investmentType = validation.checkString(investmentType);
    // totalValue = validation.checkNum(totalValue);
    // TODO; //calculate investmentPercentage based on totalValue and investmentType
    // investmentPercentage = validation.checkPercentage(investmentPercentage);

    const newInvestment = {
      userId,
      investmentType,
    //   totalValue: 0,
    //   investmentPercentage: 0,
      dateInvested: new Date(),
      subInvestments: [],
    };


    const investmentCollection = await investments();
    const insertInfo = await investmentCollection.insertOne(newInvestment);
    const newId = insertInfo.insertedId;
    const updatedFinancials = await userFinancial.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $push: { investments: insertInfo.insertedId } },
            { returnDocument: "after" }
    );
    return await this.getInvestmentById(newId.toString());
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
    // if (updatedInvestment.totalValue)
    //   updatedInvestmentData.totalValue = validation.checkNum(
    //     updatedInvestment.totalValue
    //   );
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
    let totalValue = 0;
    for (const subInvestmentId of investment.subInvestments) {
      const subInvestment = await subInvestmentCollection.findOne({
        _id: new ObjectId(subInvestmentId),
      });
      if (!subInvestment) throw "Sub investment not found";
      totalValue += subInvestment.value;
    }
    return totalValue;
  },
};

export default exportedMethods;
