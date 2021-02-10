import { Request, Response } from 'express';
import bodyParser from "body-parser";
import { createNewUser, getAllUsers, createJWToken, createNewCompanyForUser, getJobsForCompanyWithBoatDetails, createNewProposal, ProposalDetails, getAllProposalsForCompany } from "../services/userService";
import { createFullDataMock } from "../services/mockData";
import { BCRYPT_HASH_ROUND } from "../utils/definitions";
import { User, UserInterface, UserRole } from "../models/User";
import Joi from 'joi';
import bcrypt from "bcrypt";
import { CompanyInterface } from '../models/Company';
import { BoatInterface } from "../models/Boat";
import { Job, JobInterface } from "../models/Job";
import { JobInviteInterface } from "../models/JobInvite"
import {ProposalInterface, ProposalStatus} from "../models/Proposal";
import { CreateQuery } from 'mongoose';


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
interface GetWithUserRequest extends Request{
    user: UserInterface;
}

interface NewProposalRequest extends Request{
    body: ProposalDetails;
    user: UserInterface;
}

interface GetAllProposalsRequest extends Request{
    user: UserInterface;
}

interface GetAllProposalsResponseItem{
    id: ProposalInterface['id'];
    status: ProposalInterface['status'];
    date: ProposalInterface['date'];
    time: ProposalInterface['time'];
    description: ProposalInterface['description'];
    negotiable: ProposalInterface['negotiable'];
    job_id: ProposalInterface['job_id'], 
    company_id: ProposalInterface['company_id'], 
    price: ProposalInterface['price']
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
        //TODO prevent normal users from logging in
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
        console.log(err);
    }
}
export const getJobsForCompanyUser = async (req: GetWithUserRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User not found!")
        }
        const company = user.company;
        if (!company) {
            throw new Error("Company not found!")
        }
        const jobsForCompany = await getJobsForCompanyWithBoatDetails(company.id);
        if(!jobsForCompany){
            return res.send([]);
        } else {
            return res.send(jobsForCompany);
        }
      
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
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

export const postCreateMockData = async (req: Request, res: Response) => {
    try {
        const success = await createFullDataMock();
        if (!success) {
            throw new Error("Could not create mock data")
        }

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}


export const postNewProposal = async(req: NewProposalRequest, res: Response) => {
    try{
 
        const {user} = req;
        if(!user && !user.company){
            throw new Error("Invalid user");
        }
        const companyId = user.company.id;
        if(!companyId){
            throw new Error("Invalid company");
        }
        const proposalDetails = req.body;
        if(!proposalDetails){
            throw new Error("Invalid proposal Details");
        }
        const newProposal = await createNewProposal(companyId, proposalDetails);
        if(!newProposal){
           throw new Error("Could not create new proposal")
        } else {
            return res.sendStatus(200);
        }
    }catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
}

export const getAllProposals = async(req: GetAllProposalsRequest, res: Response) => {
    try{
 
        const {user} = req;
        if(!user){
            throw new Error("Invalid user");
        }
        const companyId = user.company.id;
        if(!companyId){
            throw new Error("Invalid company");
        }
       
        const allProposals = await getAllProposalsForCompany(companyId);
        const response: GetAllProposalsResponseItem[] = allProposals.map(proposal => {
            const resItem: GetAllProposalsResponseItem = {
                id: proposal.id,
                description: proposal.description,
                status: proposal.status,
                date: proposal.date,
                time: proposal.time,
                job_id: proposal.job_id,
                negotiable: proposal.negotiable,
                company_id: proposal.company_id,
                price: proposal.price
            }
            return resItem;
        })
        return res.send(response);
    
    }catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
}


// export const postNewBoat = async (req: PostNewBoatRequest, res: Response) => {
//     try {
//         const newBoatDetails = req.body;
//         if(!newBoatDetails){
//             throw new Error("Invalid boat details");
//         }

//         res.send(users);
//     } catch (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// }


