import { ObjectId } from "mongodb";
import userData from "./users.js";
import validation from "../validation.js";
import { userFinancials, investments, users } from "../config/mongoCollections.js";
import investmentData from "./investments.js";

const exportedMethods = {
    async getUserFinancialsById(id) {
        id = validation.checkId(id);
        const userFinancialsCollection = await userFinancials();
        const userFinance = await userFinancialsCollection.findOne({ _id: new ObjectId(id) });
        if (!userFinance) throw "User financials not found";
        return userFinance;
    },

    async addUserFinancials(userId, riskTolerance, investmentAmount) {
        userId = validation.checkId(userId, "User Id");
        riskTolerance = validation.checkRiskTolerance(riskTolerance, "Risk Tolerance");
        investmentAmount = validation.checkNum(investmentAmount, "Investment Amount");

        const user = await userData.getUserById(userId);
        if (!user) throw "User not found";

        const newUserFinancial = {
            userId,
            riskTolerance,
            investmentAmount,
            // portfolioValue: 0,
            investments: [],
        };

        const userFinanceCollection = await userFinancials();
        const userCollection = await users();
        const insertInfo = await userFinanceCollection.insertOne(newUserFinancial);
        const updatedUser = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { userFinancialId: insertInfo.insertedId } },
            { returnDocument: "after" }
        );
        if (!updatedUser) throw "Could not update user with financials";
        const result = {
            _id: insertInfo.insertedId,
            userId: userId,
            riskTolerance: riskTolerance,
            investmentAmount: investmentAmount,
            investments: [],
        };
        return result;
    },

    async removeUserFinancials(id) {
        const userFinanceCollection = await userFinancials();
        const deletionInfo = await userFinanceCollection.findOneAndDelete({
            _id: new ObjectId(id),
        });
        if (!deletionInfo) throw `Could not delete user financials with id of ${id}`;
        deletionInfo.investments.forEach(investmentId => {
            investmentData.removeInvestment(investmentId);
        });
        return { ...deletionInfo, deleted: true };
    },

    async totalInvestment(userFinancialsId) {
        const userFinance = await this.getUserFinancialsById(userFinancialsId);
        if (userFinance.investments.length === 0) return 0;
        const investmentCollection = await investments();
        let totalValue = 0;
        for (const investmentId of userFinance.investments) {
            const investment = await investmentCollection.findOne({ _id: new ObjectId(investmentId) });
            if (!investment) throw "Investment not found";
            const value = await investmentData.totalSubInvestment(investmentId);
            totalValue += value;
        }
        return totalValue;
    }

};

export default exportedMethods;
