import mongoose, {model, Document} from 'mongoose';

const CompanySchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    user_id: 
    {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    logo_image_url: String,
    cvr: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 10
    },
    is_paid: Boolean,
    is_enabled: Boolean,
    is_visible: Boolean,
    
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});

export interface CompanyInterface extends Document{
    name: string;
    lat: number;
    lng: number;
    user_id: string;
    logo_image_url: string;
    cvr: string;
    is_paid: boolean;
    is_enabled: boolean;
    is_visible: boolean;
}


export const Company = mongoose.model<CompanyInterface>('Company', CompanySchema);
