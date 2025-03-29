import { ObjectId } from "mongodb";
import { subInvestments, investments } from "../config/mongoCollections.js";
import validation from "../validation.js";

const exportedMethods = {
    async getSubInvestmentById(id) {
        id = validation.checkId(id);
        const subInvestmentCollection = await subInvestments();
        const subInvestment = await subInvestmentCollection.findOne({ _id: ObjectId(id) });
        if (!subInvestment) throw "Sub-investment not found";
        return subInvestment;
    },


    // Add a su
    async addSubInvestment(investmentId, subInvestmentName, totalValue) {
        investmentId = validation.checkId(investmentId);
        totalValue = validation.checkNum(totalValue);

        const subInvestmentCollection = await subInvestments();

        const newSubInvestment = {
            investmentId,
            totalValue,
            investmentPercentage,
            dateInvested: new Date(),
        };

        const insertInfo = await subInvestmentCollection.insertOne(newSubInvestment);
        if (insertInfo.insertedCount === 0) throw "Could not add sub-investment";
        return await this.getSubInvestmentById(insertInfo.insertedId.toString());
    },

    async removeSubInvestment(id) {
        const subInvestmentCollection = await subInvestments();
        const deletionInfo = await subInvestmentCollection.findOneAndDelete({
            _id: new ObjectId(id),
          });
          if (!deletionInfo) throw `Could not delete post with id of ${id}`;
          return { ...deletionInfo, deleted: true };
    }
};

export default exportedMethods;
