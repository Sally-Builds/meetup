import { Schema, model } from 'mongoose'

export interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    interests: string[];
    is_verified: boolean;
    location: string;
}

const userSchema = new Schema<IUser>({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    location: String,
    is_verified: {
        type: Boolean,
        default: false
    },
    interests: [String]
})


export default model("User", userSchema)