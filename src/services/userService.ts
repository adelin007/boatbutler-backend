import {User, UserInterface} from "../models/User";
import mongoose, {CreateQuery, Types} from "mongoose";
import { string } from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/definitions";
import { Company, CompanyInterface } from "../models/Company";
import {Job, JobInterface} from "../models/Job";
import {Boat, BoatInterface} from "../models/Boat";
import {JobInvite, JobInviteInterface} from "../models/JobInvite"
import { Proposal, ProposalInterface, ProposalStatus } from "../models/Proposal";

export interface ProposalDetails{
    jobId: string;
    date: string;
    time: string;
    text: string;
    price: number;
    fixedPrice: boolean;
}

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
        return await User.findById(objId);
    } catch(err){
        throw new Error(err);
    }

}
export const getCompanyUserById = async(companyUserId: string) => {
    try{
        const objId = mongoose.Types.ObjectId(companyUserId);
        const userWithCompany = await User.findById(objId).populate('company');
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

export const addBoat = async(boat: CreateQuery<BoatInterface>) => {
    try{
        return await Boat.create(boat);
    } catch(err){
        throw new Error(err);
    }
}

export const createJob = async(job: CreateQuery<JobInterface>) => {
    try{
        return await Job.create(job);
    } catch(err){
        throw new Error(err);
    }
}

export const createJobInvite= async(jobInvite: CreateQuery<JobInviteInterface>) => {
    try{
        return await JobInvite.create(jobInvite);
    } catch(err){
        throw new Error(err);
    }
}

interface JobWithBoatDetails{
    job: JobInterface;
    boat: BoatInterface;
    user_contact_details: string;
}

export const getJobsForCompanyWithBoatDetails = async(companyId: string) => {
    try{
        if(!companyId){
            throw new Error("Missing companyId");
        }
        const jobs = await Job.find({awarded_company_id: companyId});
        if(!jobs){
            throw new Error("Could not find jobs");
        }
        const jobsForCompanyWithBoatDetails = await Promise.all(jobs.map(async(job) => {
            const boatId = job.boat_id;
            const boat = await Boat.findById(boatId);
            const userId = boat.user_id;
            const user = await User.findById(userId);
            console.log("INNER USER: ", user)
            if(!user){
                throw new Error("Could not find user");
            }
            const result: JobWithBoatDetails={
                job: job,
                boat: boat,
                user_contact_details: user.phone_number
            };
            return result;
        }));
    
        return jobsForCompanyWithBoatDetails;
    }catch(err){
        throw new Error("Could not fetch jobs");
    }
 
}

export const createNewProposal = async(companyId: string, proposalDetails: ProposalDetails) => {
    try{
        if(!companyId || !proposalDetails){
            throw new Error("invalid proposal details");
        }
        const proposalCreateQuery: CreateQuery<ProposalInterface> = {
            description: proposalDetails.text,
            job_id: proposalDetails.jobId,
            time: proposalDetails.time,
            date: proposalDetails.date,
            negotiable: !proposalDetails.fixedPrice,
            status: ProposalStatus.PENDING,
            company_id: companyId,
            price: proposalDetails.price 
        }
        const newProposal = await Proposal.create(proposalCreateQuery);
        return newProposal;

    }catch(err){
        console.log(err);
        throw new Error("Could not create proposal")
    }
        
}

export const getAllProposalsForCompany = async(companyId: string) => {
    try{
        if(!companyId){
            throw new Error("invalid companyId");
        }
        const allProposals =  await Proposal.find({company_id: companyId});
        if(!allProposals){
            throw new Error("Could not find proposals");
        }

        return allProposals;

    }catch(err){
        console.log(err);
        throw new Error("Could not create proposal")
    }
        
}
