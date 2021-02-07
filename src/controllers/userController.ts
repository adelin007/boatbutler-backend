import { Request, Response } from 'express';
import bodyParser from "body-parser";
import { createNewUser, getAllUsers, createJWToken, createNewCompanyForUser } from "../services/userService";
import { BCRYPT_HASH_ROUND } from "../utils/definitions";
import { UserInterface } from "../models/User";
import Joi from 'joi';
import bcrypt from "bcrypt";
import { CompanyInterface } from '../models/Company';


export interface CreateNewUserInput {
    profile_pic: UserInterface['profile_pic'];
    user_role: UserInterface['user_role'];
    name: UserInterface['name'];
    email: UserInterface['email'];
    password: UserInterface['password'];
    phone_number: UserInterface['phone_number'];
    address: UserInterface['address'];
    zip_code: UserInterface['zip_code'];
    city: UserInterface['city'];
    // created_at: UserInterface['created_at'];
    // updated_at: UserInterface['updated_at'];
    // active: UserInterface['active']; 
}
export interface CreateNewUserCompanyInput {
    name: CompanyInterface['name'];
    lat: CompanyInterface['lat'];
    lng: CompanyInterface['lng'];
    // user_id: CompanyInterface['user_id'];
    logo_image_url: CompanyInterface['logo_image_url'];
    cvr: CompanyInterface['cvr'];
    // is_paid: CompanyInterface['is_paid'];
    // is_enabled: CompanyInterface['is_enabled'];
    // is_visible: CompanyInterface['is_visible'];
}

interface CreateNewUserRequest extends Request {
    body: CreateNewUserInput
}
interface CreateNewUserCompanyRequest extends Request {
    body: CreateNewUserCompanyInput,
    user: UserInterface
}

const createNewUserValidationSchema = Joi.object().keys({
    user_role: Joi.string().exist(),
    name: Joi.string().exist(),
    email: Joi.string().exist(),
    password: Joi.string().exist(),
    phone_number: Joi.string().exist(),
    address: Joi.string().exist(),
    zip_code: Joi.string().exist(),
    city: Joi.string().exist(),
    profile_pic: Joi.string()
});

const createNewUserCompanyValidationSchema = Joi.object().keys({
    name: Joi.string().exist(),
    lat: Joi.number().exist(),
    lng: Joi.number().exist(),
    logo_image_url: Joi.string(),
    cvr: Joi.string().exist()
});
interface UserLoginCredentials extends Request {
    body: {
        email: string;
        password: string;
    }

}
interface GetUserDetailsRequest extends Request {
    user: UserInterface;
}
interface GetUserDetailsResponse {
    profile_pic: UserInterface['profile_pic'];
    user_role: UserInterface['user_role'];
    name: UserInterface['name'];
    email: UserInterface['email'];
    phone_number: UserInterface['phone_number'];
    address: UserInterface['address'];
    zip_code: UserInterface['zip_code'];
    city: UserInterface['city'];
    company: UserInterface['company']
}

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
        // hash password
        newUserDetails.password = await bcrypt.hash(newUserDetails.password, BCRYPT_HASH_ROUND);
        const savedUser = await createNewUser({ ...newUserDetails, active: true, created_at: "", updated_at: "" });
        if (!savedUser) {
            throw new Error("Could not save User");
        }
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);

    }

}

export const postNewUserCompany = async (req: CreateNewUserCompanyRequest, res: Response) => {
    try {
        const result = createNewUserCompanyValidationSchema.validate(req.body);
        const errors = result.error;
        if (errors) {
            throw new Error(errors.message);
        }
        const newUserCompanyDetails = req.body;
        if (!newUserCompanyDetails || !req.user) {
            throw new Error("Invalid new user details");
        }
        const userId = req.user.id;
        await createNewCompanyForUser({ ...newUserCompanyDetails, is_enabled: true, is_paid: true, is_visible: true, user_id: userId });
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);

    }


}

export const postUserLoginDetails = async (req: UserLoginCredentials, res: Response) => {
    try {
        const { email, password } = req.body;
        const jwToken = await createJWToken(email, password);
        if (!jwToken) {
            throw new Error("Could not create JWT");
        }
        res.send({ token: jwToken });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export const getUserDetails = async (req: GetUserDetailsRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User not found!")
        }
        const response: GetUserDetailsResponse = {
            name: user.name,
            profile_pic: user.profile_pic,
            user_role: user.user_role,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            zip_code: user.zip_code,
            city: user.city,
            company: user.company
        };
        return res.send(response);
    } catch (err) {

    }
}


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.send(users);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}