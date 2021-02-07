import mongoose, {model, Document, Schema} from 'mongoose';

export enum BoatType{
    SPEED_BOAT = "SPEED_BOAT",
    SAIL_BOAT = "SAIL_BOAT",
    YACHT = "YACHT"
}


const JobSchema = new mongoose.Schema({
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
    
    
    
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});

export interface JobInterface extends Document{
    name: string;
    year: number;
    boat_type: BoatType;
    user_id: string;
    address: string;
    city: string;
    description: string;
}


export const Company = mongoose.model<BoatInterface>('Boat', BoatSchema);
