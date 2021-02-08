import mongoose, {model, Document, Schema} from 'mongoose';

export enum ProposalStatus{
    ACCEPTED = "ACCEPTED",
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}

const ProposalSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ProposalStatus
    },
    date: String,
    time: String,
    description: String,
    negotiable: Boolean,
    job_id: Schema.Types.ObjectId, 
    company_id: Schema.Types.ObjectId, 
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});

export interface ProposalInterface extends Document{
    status: ProposalStatus;
    date: string;
    time: string;
    description: string;
    negotiable: boolean;
    job_id: Schema.Types.ObjectId, 
    company_id: Schema.Types.ObjectId, 
}

export const Proposal = mongoose.model<ProposalInterface>('Proposal', ProposalSchema);
