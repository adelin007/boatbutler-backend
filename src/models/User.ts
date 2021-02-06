import mongoose, {model, Document} from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    active: Boolean
});

export interface UserInterface extends Document{
  name: string;
  active: boolean;
}


export const User = mongoose.model<UserInterface>('User', UserSchema);
