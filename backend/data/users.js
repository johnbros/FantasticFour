import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import validation from "../validation.js";

const saltRounds = 11;

export async function getUserById(id){
    id = validation.checkId(id, "User Id");
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw "User not found";
    const result = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userFinancialId: user.userFinancialId,
        createdAt: user.createdAt,  
    };
    return result;
}

export async function signUpUser(firstName, lastName, email, password){
    firstName = validation.checkName(firstName, "firstName");
    lastName = validation.checkName(lastName, "lastName");
    email = validation.checkEmail(email, "email");
    password = validation.checkPassword(password);
    
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = {
        firstName,
        lastName,
        email,
        password: hash,
        userFinancialId: null,
        createdAt: new Date(),
    };

    const userCollection = await users();
    
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add user";
    const result = {
        _id: insertInfo.insertedId,
        firstName,
        lastName,
        email,
        userFinancialId: null,
        createdAt: new Date(),
    };
    return result;
}

export async function loginUser(email, password){
    email = validation.checkEmail(email, "email");
    password = validation.checkPassword(password);

    const userCollection = await users();
    const user = await userCollection.findOne({ email });

    if (!user) throw "Either the username or password is invalid";
    let match = await bcrypt.compare(password, user.password);
    if (!match) throw "Either the username or password is invalid";

    const payload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userFinancialId: user.userFinancialId,
        createdAt: user.createdAt,  
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return {
        message: 'Login successful!',
        token: token,
        payload: payload,
    };
}

export async function removeUser(id){
    id = validation.checkId(id, "User Id");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id),
        });
        if (!deletionInfo) throw `Could not delete post with id of ${id}`;
        return { ...deletionInfo, deleted: true };
}


