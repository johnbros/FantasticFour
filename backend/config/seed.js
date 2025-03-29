import { dbConnection, closeConnection } from '../mongoConnection.js';
import { users, userFinancials, investments, subInvestments } from '../mongoCollections.js';
import {addUser} from '../data/users.js';

async function main() {
    // Connect to the database
  const db = await dbConnection();

  console.log('Dropping existing collections (if they exist)...');
  try {
    await db.collection('users').drop();
    await db.collection('userFinancials').drop();
    await db.collection('investments').drop();
    await db.collection('subInvestments').drop();
    console.log('Collections dropped.');
  } catch (e) {
    // Ignore errors if collections didn't exist (e.g., code 26)
    if (e.code !== 26) {
        console.error('Error dropping collections:', e);
    } else {
        console.log('Collections did not exist, skipping drop.');
    }
  }
  
  addUser('James', 'Murphy', 'jmurphy10@stevens.edu', 'securePassword');




}