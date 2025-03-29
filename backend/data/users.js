import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcryptjs";
import validation from "../validation.js";

const exportedMethods = {
    async getUserById(id){
        id = validation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: ObjectId(id) });
        if (!user) throw "User not found";
        return user;    
    },

    async addUser(firstName, lastName, email, password){

        firstName = validation.checkString(firstName, "firstName");
        lastName = validation.checkString(lastName, "lastName");
        password = validation.checkPassword(password);
        const userCollection = await users();
        const hash = await bcrypt.hash(password, 16);

        const newUser = {
            firstName,
            lastName,
            email,
            password: hash,
            createdAt: new Date(),
        };
        
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user";
        return await this.getUserById(insertInfo.insertedId.toString());
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
