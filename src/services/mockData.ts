import { User, UserInterface, UserRole } from "../models/User";
import mongoose, { CreateQuery } from "mongoose";
import bcrypt from "bcrypt";
import { BCRYPT_HASH_ROUND } from "../utils/definitions";
import { Company, CompanyInterface } from "../models/Company";

import { Job, JobCategory, JobInterface, JobMediaInterface, JobSubCategory, MediaType } from "../models/Job";
import { Boat, BoatInterface, BoatType } from "../models/Boat";
import { JobInvite, JobInviteInterface } from "../models/JobInvite"
import { createJob, createJobInvite, createNewUser, getUserById } from "./userService";

export const createUserMock = async () => {
    try {
        const pass = await bcrypt.hash("john123", BCRYPT_HASH_ROUND);
        if (!pass) {
            throw new Error("Password could not be hashed");
        }
        const newUserData: CreateQuery<UserInterface> = {
            name: "john",
            email: "john@email.com",
            password: pass,
            profile_pic: "",
            address: "Main St. 1",
            zip_code: "1000",
            city: "Copenhagen",
            active: true,
            user_role: UserRole.USER,
            created_at: "",
            updated_at: "",
            phone_number: "12345"
        }
        const newUser = await createNewUser(newUserData);
        if (!newUser) {
            throw new Error("User could not be created");
        }
        return newUser;

    } catch (err) {
        console.log(err);
    }

}

export const createCompanyUserMock = async () => {
    try {
        const pass = await bcrypt.hash("company123", BCRYPT_HASH_ROUND);
        if (!pass) {
            throw new Error("Password could not be hashed");
        }
        const newUserData: CreateQuery<UserInterface> = {
            name: "company",
            email: "company@email.com",
            password: pass,
            profile_pic: "",
            address: "Business St. 3",
            zip_code: "1000",
            city: "Copenhagen",
            active: true,
            user_role: UserRole.COMPANY,
            created_at: "",
            updated_at: "",
            phone_number: "889900",
        }
        const newUser = await createNewUser(newUserData);
        if (!newUser) {
            throw new Error("User could not be created");
        }
        const newCompanyData: CreateQuery<CompanyInterface> = {
            name: "BOrAT Repair A/S",
            lat: 55.6,
            lng: 12.5,
            cvr: "1234567890",
            is_enabled: true,
            is_paid: true,
            is_visible: true,
            user_id: newUser.id,
            logo_image_url: ""
        }
        const company = await Company.create(newCompanyData);
        if (!company) {
            throw new Error("Could not create company");
        }
        newUser.company = company;
        const savedUserWithCompany = await newUser.save();
        if (!savedUserWithCompany) {
            throw new Error("Could not save user with company");
        }
        const fullUserWithCompany = await User.findById(savedUserWithCompany.id).populate('company');
        return fullUserWithCompany;

    } catch (err) {
        console.log(err);
    }

}

export const createBoatMock = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error("Missing userId");
        }
        const user = await getUserById(userId);
        if (!user) {
            throw new Error("Could not find user");
        }
        const newBoatData: CreateQuery<BoatInterface> = {
            name: "first_boat",
            address: "Boat St 1",
            year: 2000,
            city: "Copenhagen",
            description: "My awesome boat",
            boat_type: BoatType.SPEED_BOAT,
            user_id: user.id
        }
        const newBoat = await Boat.create(newBoatData);
        if (!newBoat) {
            throw new Error("Boat could not be created");
        }
        return newBoat;

    } catch (err) {
        console.log(err);
    }

}

export const createJobInviteMock = async (jobId: string, companyId: string) => {
    try {
        if (!jobId || !companyId) {
            throw new Error("Invalid input");
        }
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error("Could not find Job");
        }
        const company = await Company.findById(companyId);
        if (!company) {
            throw new Error("Could not find Company");
        }

        const newJobInviteData: CreateQuery<JobInviteInterface> = {
            job_id: job.id,
            company_id: company.id
        }
        const newJobInvite = await JobInvite.create(newJobInviteData);
        if (!newJobInvite) {
            throw new Error("JobInvite could not be created");
        }
        return newJobInvite;

    } catch (err) {
        console.log(err);
    }

}

export const createJobMock = async (userId: string, boatId: string, awarded_company_id: string, iterator: number) => {
    try {
        if (!userId || !boatId || !awarded_company_id) {
            throw new Error("Invalid inputs");
        }
        const user = await getUserById(userId);
        if (!user) {
            throw new Error("Could not find user");
        }

        const boat = await Boat.findById(boatId);
        if (!boat) {
            throw new Error("Could not find boat");
        }

        const company = await Company.findById(awarded_company_id);
        if (!company) {
            throw new Error("Could not find company");
        }

        const imageURL = ((iterator % 2 === 0) ?
            "https://images.unsplash.com/photo-1575893240675-17e719ffa7c5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" :
            "https://images.unsplash.com/photo-1511311855362-67f5492671ab?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1650&q=80"
        )

        const newJobData: CreateQuery<JobInterface> = {
            user_id: user.id,
            awarded_company_id: company.id,
            category: JobCategory.A,
            subcategory: JobSubCategory.SUB_A,
            description: `Fix ${(Math.random() + 1).toString(36).substr(1, 6)}`,
            allow_contact_by_app: true,
            job_media: [{
                url: imageURL,
                type: MediaType.IMAGE,
            }],
            lat: 55.6 + Math.floor(Math.random() * 10),
            lng: 12.5 + Math.floor(Math.random() * 10),
            is_emergency: true,
            is_done: false,
            title: `Job no ${Math.floor(Math.random() * 100)}`,
            price: 5000 + Math.floor(Math.random() * 100),
            due_date: new Date(Date.now()).toDateString(),
            due_time: "15:00:00",
            boat_id: boat.id

        }
        const newJob = await Job.create(newJobData);
        if (!newJob) {
            throw new Error("Job could not be created");
        }
        return newJob;

    } catch (err) {
        console.log(err);
    }

}

export const createFullDataMock = async () => {
    try {
        // wipe database before creating new mock data
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        const user = await createUserMock();
        const userWithCompany = await createCompanyUserMock();
        const boat = await createBoatMock(user.id);
        
        for(let i= 0; i< 3; i++){
            const job = await createJobMock(user.id, boat.id, userWithCompany.company.id, i);
            const jobInvite = await createJobInviteMock(job.id, userWithCompany.company.id);
        }
        return true;

    } catch (err) {
        console.log(err);
        return false;
    }

}
