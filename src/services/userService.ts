import {User, UserInterface} from "../models/User";
import mongoose, {CreateQuery} from "mongoose";
import { string } from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/definitions";
import { Company, CompanyInterface } from "../models/Company";



export const createNewUser = async(user: CreateQuery<UserInterface>) => {
    try{
        if(user){
            console.log("SERVICE USR: ", user);
           return await User.create(user);
        }
    } catch(err){
        throw new Error(err);
    }
   

}

export const createNewCompanyForUser = async(company: CreateQuery<CompanyInterface>) => {
    try{
        if(!company){
            throw new Error("Company missing");
        }
        console.log("SERVICE COMPANY: ", company);
        const userId = mongoose.Types.ObjectId(company.user_id);
        if(!userId){
            throw new Error("Invalid userId");
        }
        const newCompany = await Company.create(company);
        if(!newCompany){
            throw new Error("Could not save new company");
        }
        const existingUser = await User.findById(userId);
        if(!existingUser){
            throw new Error("Could not find user");
        }
        existingUser.company = newCompany;
        await existingUser.save();

    } catch(err){
        throw new Error(err);
    }
   

}


export const getUserById = async(userId: string) => {
    try{
        const objId = mongoose.Types.ObjectId(userId);
        console.log("ID IZ: ", objId)
        return await User.findById(objId);
    } catch(err){
        throw new Error(err);
    }
   

}
export const getCompanyUserById = async(companyUserId: string) => {
    try{
        const objId = mongoose.Types.ObjectId(companyUserId);
        const userWithCompany = await User.findById(objId).populate('Company');
        if(!userWithCompany){
            throw new Error("User with company could not be found");
        }
        return userWithCompany;
    } catch(err){
        throw new Error(err);
    }
   

}

export const getUserByEmail = async(email: string) => {
    try{
        return await User.findOne({email: email});
    } catch(err){
        throw new Error(err);
    }
   

}



export const getAllUsers = async() => {
    try{
        return await User.find();
    }catch(err){
        throw new Error(err);
    }
}

export const createJWToken = async(email: string, password: string) => {
    try{
        const user = await getUserByEmail(email);
        if(!user){
            throw new Error("User not found")
        } 
        const matches = await bcrypt.compare(password, user.password);
        if(matches){
            const token = jwt.sign({
                user_id: user.id,
                user_role: user.user_role
            }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
           return token;
        }

    }catch(err){
        throw new Error(err);
    }
    
}