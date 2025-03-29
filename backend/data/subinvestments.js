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


    // Add a sub investment
    async addSubInvestment(investmentId, subInvestmentName, totalValue) {
        investmentId = validation.checkId(investmentId);
        totalValue = validation.checkNum(totalValue);

        const subInvestmentCollection = await subInvestments();
        const investmentCollection = await investments();
        const investmentsInfo = await investmentCollection.getInvestmentById(investmentId);
        if (!investmentsInfo) throw "Investment not found";
        const investmentPercentage = (totalValue / (investmentsInfo.totalValue + totalValue)) * 100;
        if (investmentPercentage > 100) throw "Investment percentage cannot exceed 100%";

        const newSubInvestment = {
            investmentId,
            totalValue,
            subInvestmentName,
            investmentPercentage,
            dateInvested: new Date(),
        };

        const insertInfo = await subInvestmentCollection.insertOne(newSubInvestment);
        if (insertInfo.insertedCount === 0) throw "Could not add sub-investment";

        const updatedInvestment = await investmentCollection.findOneAndUpdate(
            { _id: ObjectId(investmentId) },
            { $push: { subInvestments: investmentsInfo.add(insertInfo.insertedId) } },
            { returnDocument: "after" }
        );
        if (!updatedInvestment) throw "Could not update investment with sub-investment";

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
