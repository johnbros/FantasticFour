import { ObjectId } from "mongodb";
import {getUserById} from "./users.js";
import validation from "../validation.js";
import { userFinancials, investments } from "../config/mongoCollections.js";

const exportedMethods = {
    async getUserFinancialsById(id) {
        id = validation.checkId(id);
        const userFinancialsCollection = await userFinancials();
        const userFinance = await userFinancialsCollection.findOne({ _id: ObjectId(id) });
        if (!userFinancials) throw "User financials not found";
        return userFinance;
    },

    async createUserFinacials(riskTolerance, investmentAmount) {
        const userFinance = await userFinancials();
        riskTolerance = validation.checkRiskTolerance(riskTolerance);
        if (!investmentAmount || typeof investmentAmount !== 'number' || isNaN(investmentAmount) || investmentAmount < 0) {
            throw "Investment amount must be a valid positive number";
        }
        const user = await getUserById(id);
        if (!user) throw "User not found";
        const userFinancials = await userFinance.findOne({ _id: ObjectId(id) });
        if (userFinancials) throw "User financials already exist";


        let portfolioValue = 0;
        let investments = []

        const newUserFinancial = {
            portfolioValue,
            riskTolerance,
            investments,
        };
        
        const insertInfo = await userFinance.insertOne(newUserFinancial);
        if (insertInfo.insertedCount === 0) throw "Could not add user financials";

        const updatedUser = await userCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: { userFinancialID: insertInfo.insertedId } },
            { returnDocument: "after" }
        );
        if (!updatedUser) throw "Could not update user with financials";

        return updatedUser;
    },

    //Update users total portfolio value
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
        return user;
    },


    //Add investment to user
    async addInvestmentToUser(id, investmentId) {
        id = validation.checkId(id);
        investmentId = validation.checkId(investmentId);

        // Check if the user exists
        const userFinanceCollection = await userFinancials();
        const investmentCollection = await investments();

        // Get the user and investment information for the new investment
        const investmentInfo = await investmentCollection.getInvestmentById(investmentId);
        if (!investmentInfo) throw "Investment not found";
        
        
        
        // Check if the user financial collection exists (it should if the user exists)
        const financialInfo = await userFinanceCollection.findOne({ _id: ObjectId(id) });
        if (!financialInfo) throw "User financials not found";

        const user = await this.updatePortfolioValue(id, investmentInfo.totalValue);
        if (!user) throw "Problem updating Portfolio Value";

        // List of investment IDs for the user
        const investmentIds = financialInfo.investments;
        
        if (investmentIds.includes(investmentId)) throw "Investment already added to user";
        investmentIds.add(investmentId);

        const updatedUserFinance = await userFinanceCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $push: { investments: investmentIds } },
            { returnDocument: "after" }
        );

        if (!updatedUserFinance) throw "Could not add investment to user";
        return user;
    }
};

export default exportedMethods;
