import * as index from "./data/index.js"; // ✅ Correct way
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import users from "./data/users.js";
import investments from "./data/investments.js";
import userFinancials from "./data/userfinancials.js";
import subInvestments from "./data/subInvestments.js";
import { ObjectId } from "mongodb";

import dotenv from "dotenv";
dotenv.config();
const db = await dbConnection();

// Drop the existing database for a fresh start
await db.dropDatabase();
const userCollection = db.collection("users");
const investmentCollection = db.collection("investments");
const userFinancialsCollection = db.collection("userFinancials");
const subInvestmentCollection = db.collection("subInvestments");

// Function to add a user to the database
const usersStuff = async () => {
  try {
    // Example user data, modify according to your needs
    const userinfo1 = {
      _id: new ObjectId(),
      firstName: "Alan",
      lastName: "Atrach",
      email: "user1@example.com",
      password: "Password123!",
    };

    const userinfo2 = {
      _id: new ObjectId(),
      firstName: "Alan",
      lastName: "Atrach",
      email: "user1@exampling.com",
      password: "Password123!",
    };

    // Add user to the users collection

    const user1 = await users.signUpUser(
      userinfo1.firstName,
      userinfo1.lastName,
      userinfo1.email,
      userinfo1.password
    );

    const user2 = await users.signUpUser(
      userinfo2.firstName,
      userinfo2.lastName,   
      userinfo2.email,
      userinfo2.password
    );


    const getUserById = await users.getUserById(user1._id.toString());
    // console.log("User checked:", getUserById);
    const checkSignin = await users.loginUser(
      userinfo1.email,
      userinfo1.password
    );
    // console.log("User signed in:", checkSignin);

    const delete2 = await users.removeUser(user2._id.toString());


  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const everythingelse = async () => {
  const user = await users.signUpUser("someone", "another", "asfa@assdf.com", "Password123!");
  const finsForUser = await userFinancials.addUserFinancials(user._id, 1, 10000);
  console.log("User financials added:", finsForUser);

  try {
    const investmentinfo1 = {
      investmentType: "Stock",
      totalValue: 1000,
      dateInvested: new Date("2023-10-01"),
    };

    const investmentinfo2 = {
      investmentType: "Bond",
      totalValue: 2000,
      dateInvested: new Date("2023-5-01"),
    };

    // Add user to the users collection
    const investment1 = await investments.addInvestment(
      finsForUser._id,
      investmentinfo1.investmentType,
      investmentinfo1.totalValue,
      investmentinfo1.dateInvested
    );

    const investment2 = await investments.addInvestment(
      finsForUser._id,
      investmentinfo2.investmentType,
      investmentinfo2.totalValue,
      investmentinfo2.dateInvested
    );

    const getInvestmentById = await investments.getInvestmentById(
      investment1._id.toString()
    );
    console.log("Investment checked:", getInvestmentById);

    const Subinvestment = await subInvestments.addSubInvestment(
      investment1._id,
      "subInvestment",
      1000,
    );
    const subInvestment2 = await subInvestments.addSubInvestment(
      investment1._id,
      "subInvestment again",
      3000,
    );

    // const delete2 = await investments.removeInvestment(
    //   investment2._id
    // );

    const delete2 = await investments.removeInvestment(
      investment1._id
    );
    console.log("User removed:", delete2);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Call the addUser function to add the user
await usersStuff();
await everythingelse();


// Close the database connection
await closeConnection();
