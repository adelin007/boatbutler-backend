import {User, UserInterface} from "../models/User";
import {CreateQuery} from "mongoose";


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

export const getAllUsers = async() => {
    try{
        return await User.find();
    }catch(err){
        throw new Error(err);
    }
}