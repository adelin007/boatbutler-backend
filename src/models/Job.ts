import mongoose, {model, Document, Schema} from 'mongoose';

export enum MediaType{
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}
export enum JobCategory{
    A = "A",
    B = "B"
}
export enum JobSubCategory{
    SUB_A = "SUB_A",
    SUB_B = "SUB_B"
}
const JobMediaSchema = new mongoose.Schema({
   type: {
       type: String,
       enum: MediaType
   },
   url: String,
   job_id: String
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});


const JobSchema = new mongoose.Schema({
    allow_contact_by_app: Boolean,
    category: {
        type: String,
        enum: JobCategory
    },
    subcategory:{
        type: String,
        enum: JobSubCategory
    },
    is_emergency: Boolean,
    title: String,
    description: String,
    lat: Number,
    lng: Number,
    price: Number,
    due_date: String,
    due_time: String,
    is_done: Boolean,
    user_id: Schema.Types.ObjectId, 
    awarded_company_id: Schema.Types.ObjectId,
    boat_id: Schema.Types.ObjectId,
    job_media: [{
        type: {
            type: String,
            enum: MediaType
        },
        url: String
    }]
    // job_media:[JobMediaSchema]
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});


export interface JobMediaInterface{
    type: MediaType;
    url: string;
}
export interface JobInterface extends Document{
    allow_contact_by_app: boolean,
    category: JobCategory,
    subcategory: JobSubCategory,
    is_emergency: boolean;
    title: string;
    description: string;
    lat: number;
    lng: number;
    price: number;
    due_date: string;
    due_time: string;
    is_done: boolean;
    user_id: string; 
    awarded_company_id: string;
    boat_id: string;
    job_media: [JobMediaInterface];
   
}


export const Job = mongoose.model<JobInterface>('Job', JobSchema);
