import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcryptjs";
import validation from "../validation.js";

const saltRounds = 11;

const exportedMethods = {
    async getUserById(id){
        id = validation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: ObjectId(id) });
        if (!user) throw "User not found";
        TODO //make sure to remove password from user object before returning it
        return user;    
    },

    async addUser(firstName, lastName, email, password){
        firstName = validation.checkName(firstName, "firstName");
        lastName = validation.checkName(lastName, "lastName");
        password = validation.checkPassword(password);
        const userCollection = await users();
        const hash = await bcrypt.hash(password, saltRounds);

        const newUser = {
            firstName,
            lastName,
            email,
            password: hash,
            createdAt: new Date(),
        };
        
        const insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw "Could not add user";
        const result = {
            _id: insertInfo.insertedId,
            firstName,
            lastName,
            email,
            createdAt: new Date(),
        };
        return result;
    },

    async removeUser(id){
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
            _id: new ObjectId(id),
          });
          if (!deletionInfo) throw `Could not delete post with id of ${id}`;
          return { ...deletionInfo, deleted: true };
    }

};

export default exportedMethods;
