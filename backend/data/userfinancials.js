import { ObjectId } from "mongodb";
import {getUserById} from "./users.js";
import validation from "../validation.js";
import { userFinancials } from "../config/mongoCollections.js";

const exportedMethods = {
    async getUserFinancialsById(id) {
        id = validation.checkId(id);
        const userFinancialsCollection = await userFinancials();
        const userFinance = await userFinancialsCollection.findOne({ _id: ObjectId(id) });
        if (!userFinancials) throw "User financials not found";
        return userFinance;
    },

    async addUserFinacials(id, riskTolerance, investmentAmount) {
        const userFinance = await userFinancials();
        id = validation.checkId(id);
        riskTolerance = validation.checkRiskTolerance(riskTolerance);
        if (!investmentAmount || typeof investmentAmount !== 'number' || isNaN(investmentAmount) || investmentAmount < 0) {
            throw "Investment amount must be a valid positive number";
        }
        const user = await getUserById(id);
        if (!user) throw "User not found";

        let portfolioValue = 0;
        let investments = []

        const newUserFinancial = {
            id,
            portfolioValue,
            riskTolerance,
            investments,
        };
        const insertInfo = await userFinance.insertOne(newUserFinancial);
        if (insertInfo.insertedCount === 0) throw "Could not add user";
        return id;
    },


    async updatePortfolioValue(id, valueChange) {
        id = validation.checkId(id);
        if (!valueChange || typeof valueChange !== 'number' || isNaN(valueChange)) {
            throw "Value change must be a valid number";
        }
        const user = await getUserById(id);
        if (!user) throw "User not found";
        const userFinance = await userFinancials();
        const financialInfo = await userFinance.findOne({ _id: ObjectId(id) });
        if (!financialInfo) throw "User financials not found";
        const updatedUserFinance = await userFinancialsCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $inc: { portfolioValue: financialInfo.portfolioValue + valueChange } },
            { returnDocument: "after" }
        );
        if (!updatedUserFinance) throw "Could not update portfolio value";
        return updatedUserFinance.value;
    },
};

export default exportedMethods;
