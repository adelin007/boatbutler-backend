import mongoose, {model, Document, Schema} from 'mongoose';

const JobInviteSchema = new mongoose.Schema({
    job_id: Schema.Types.ObjectId, 
    company_id: Schema.Types.ObjectId, 
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});

export interface JobInviteInterface extends Document{
    job_id: string; 
    company_id: string; 
}


export const JobInvite = mongoose.model<JobInviteInterface>('JobInvite', JobInviteSchema);
