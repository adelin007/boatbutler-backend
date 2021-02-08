import mongoose, {model, Document} from 'mongoose';

export enum BoatType{
    SPEED_BOAT = "SPEED_BOAT",
    SAIL_BOAT = "SAIL_BOAT",
    YACHT = "YACHT"
}


const BoatSchema = new mongoose.Schema({
    name: String,
    year: Number,
    boat_type: {
        type: String,
        enum: BoatType
    },
    user_id: 
    {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    address: String,
    city: String,
    description: String
    
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});

export interface BoatInterface extends Document{
    name: string;
    year: number;
    boat_type: BoatType;
    user_id: string;
    address: string;
    city: string;
    description: string;
}


export const Boat = mongoose.model<BoatInterface>('Boat', BoatSchema);
