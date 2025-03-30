import * as index from './data/index.js'; // ✅ Correct way
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import users from "./data/users.js";
import investments from "./data/investments.js";
import userFinancials from "./data/userfinancials.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();

// Drop the existing database for a fresh start
await db.dropDatabase();

// Function to add a user to the database
const addUser = async () => {
  try {
    // Example user data, modify according to your needs
    const user = {
      _id: new ObjectId(), // automatically generate a unique ObjectId
      firstName: "Alan", // User's name or username
      lastName: "Atrash",
      email: "user1@example.com", // User's email
      password: "Password123!", // User's password (should be hashed in production)
    //   financials: userFinancials, // Reference to the user's financial data
    //   investments: investments, // Reference to the user's investments data
    };

    // Add user to the users collection
    const userCollection = db.collection("users");
    const result = await userCollection.insertOne(user);

    console.log("User created:", result);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Call the addUser function to add the user
await addUser();

// Close the database connection
await closeConnection();
