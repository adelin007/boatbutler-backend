import mongoose, {model, Document, Schema} from 'mongoose';
import { CompanyInterface } from './Company';

export enum UserRole{
    USER = "USER",
    COMPANY = "COMPANY"
}
const UserSchema = new mongoose.Schema({
    profile_pic: String,
    user_role: {
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    } ,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    phone_number: String,
    address: String,
    zip_code: String,
    city: String,
    // created_at: String,
    // updated_at: String,
    active: Boolean,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
}, {timestamps: {createdAt: 'created_at', updatedAt: "updated_at"}});

export interface UserInterface extends Document{
    profile_pic: string;
    user_role: UserRole;
    name: string;
    email: string;
    password: string;
    phone_number: string;
    address: string;
    zip_code: string;
    city: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    company?: CompanyInterface;
}


export const User = mongoose.model<UserInterface>('User', UserSchema);
