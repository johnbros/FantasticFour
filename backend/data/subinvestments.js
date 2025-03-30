import { ObjectId } from "mongodb";
import { subInvestments, investments } from "../config/mongoCollections.js";
import validation from "../validation.js";
import investment from "./investments.js";

const exportedMethods = {
    async getSubInvestmentById(id) {
        id = validation.checkId(id);
        const subInvestmentCollection = await subInvestments();
        const subInvestment = await subInvestmentCollection.findOne({ _id: new ObjectId(id) });
        if (!subInvestment) throw "Sub investment not found";
        return subInvestment;
    },

    // Add a sub investment
    async addSubInvestment(investmentId, name, value) {
        investmentId = validation.checkId(investmentId, "Investment Id");
        name = validation.checkString(name, "Subinvestment name");
        value = validation.checkNum(value, "Subinvestment value");

        const subInvestmentCollection = await subInvestments();
        const investmentsCollection = await investments();
        const investmentsInfo = await investment.getInvestmentById(investmentId);
        if (!investmentsInfo) throw "Investment not found";
        const investmentPercentage = (value / (investmentsInfo.value + value)) * 100;
        if (investmentPercentage > 100) throw "Investment percentage cannot exceed 100%";

        const newSubInvestment = {
            investmentId: new ObjectId(investmentId),
            name,
            value,
            investmentPercentage,
            dateInvested: new Date(),
        };

        const insertInfo = await subInvestmentCollection.insertOne(newSubInvestment);
        if (insertInfo.insertedCount === 0) throw "Could not add sub-investment";

        const updatedInvestment = await investmentsCollection.updateOne(
            { _id: new ObjectId(investmentId) },
            { $addToSet: { subInvestments: insertInfo.insertedId } },
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
    },

};

export default exportedMethods;
