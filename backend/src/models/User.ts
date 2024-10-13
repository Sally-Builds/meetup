import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser {
    _id: string;
    full_name: string;
    username: string;
    dob: string;
    email: string;
    password: string;
    occupation: string;
    gender: "male" | "female";
    phone: string;
    interests: string[];
    is_verified: boolean;
    location: string;
    profile_image: { url: string, publicId: string };
    images: { url: string, publicId: string }[]
}

const userSchema = new Schema<IUser>({
    full_name: String,
    username: String,
    dob: String,
    email: String,
    password: String,
    occupation: String,
    phone: String,
    location: String,
    gender: {
        type: String,
        enum: ["male", "female"]
    },
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