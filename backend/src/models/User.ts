import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    interests: string[];
    is_verified: boolean;
    location: string;
    profile_image: { url: string, publicId: string };
    images: { url: string, publicId: string }[]
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
    interests: [String],
    profile_image: {
        url: String,
        publicId: String
    },
    images: [
        {
            url: String,
            publicId: String
        }
    ]
})

userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});


export default model("User", userSchema)