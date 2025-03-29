import { ObjectId } from "mongodb";
import { subInvestments } from "../config/mongoCollections";

const exportedMethods = {
    async getInvestmentById(id) {
        id = validation.checkId(id);
        const investmentCollection = await investments();
        const investment = await investmentCollection.findOne({ _id: ObjectId(id) });
        if (!investment) throw "Investment not found";
        return investment;
    },

    async addInvestment(userId, investmentName, investmentType, totalValue, investmentPercentage, dateInvested) {
        userId = validation.checkId(userId);
        investmentName = validation.checkString(investmentName);
        TODO // check if investmentName is part of the investmentType
        totalValue = validation.checkNum(totalValue);
        investmentPercentage = validation.checkPercentage(investmentPercentage);
        investmentType = validation.checkString(investmentType);
        amountInvested = validation.checkNum(amountInvested);    
        TODO // dateInvested = validation.checkDateInvested(dateInvested);

        const investmentCollection = await investments();

        const newInvestment = {
            userId,
            investmentName,
            investmentType,
            totalValue,
            investmentPercentage,
            dateInvested: new Date(),
            subInvestments: [],
        };

        const insertInfo = await investmentCollection.insertOne(newInvestment);
        if (insertInfo.insertedCount === 0) throw "Could not add investment";
        return await this.getInvestmentById(insertInfo.insertedId.toString());
    },

    async removeInvestment(id) {
        const investmentCollection = await investments();
        const deletionInfo = await investmentCollection.findOneAndDelete({
            _id: new ObjectId(id),
          });
          if (!deletionInfo) throw `Could not delete post with id of ${id}`;
          return { ...deletionInfo, deleted: true };
    }
};

export default exportedMethods;
