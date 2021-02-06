import { Request, Response } from 'express';
import bodyParser from "body-parser";
import { createNewUser, getAllUsers } from "../services/userService";
import { UserInterface } from "../models/User";
import Joi from 'joi';


export interface CreateNewUserInput {
    name: UserInterface['name'];
}

interface CreateNewUserRequest extends Request {
    body: CreateNewUserInput
}

const createNewUserValidationSchema = Joi.object().keys({
    name: Joi.string().exist(),
});
export const postNewUser = async (req: CreateNewUserRequest, res: Response) => {
    try {
        const result = createNewUserValidationSchema.validate(req.body);
        const errors = result.error;
        if (errors) {
            throw new Error(errors.message);
        } 
        const newUserDetails = req.body;
        if (!newUserDetails) {
            throw new Error("Invalid new user details");
        }
        const savedUser = await createNewUser({ ...newUserDetails, active: true });
        console.log("created user: ", savedUser)
        if (!savedUser) {
            throw new Error("Could not save User");
        }

        return res.send(savedUser);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);

    }


}
export const getUsers = async(req: Request, res: Response) => {
    try{
        const users = await getAllUsers();
        res.send(users);
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}