import * as index from "./data/index.js"; // ✅ Correct way
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import users from "./data/users.js";
import investments from "./data/investments.js";
import userFinancials from "./data/userfinancials.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();

// Drop the existing database for a fresh start
await db.dropDatabase();
const userCollection = db.collection("users");
const investmentCollection = db.collection("investments");
const userFinancialsCollection = db.collection("userFinancials");
const subInvestmentCollection = db.collection("subInvestments");

// Function to add a user to the database
const seed = async () => {
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
    console.log("User checked:", getUserById);
    
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Call the addUser function to add the user
await seed();

// Close the database connection
await closeConnection();
