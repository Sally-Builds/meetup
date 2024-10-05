import User, { IUser } from "../models/User";
import { CustomError } from "../utils/customError";
import bcrypt from 'bcryptjs';
import { createToken } from "../utils/token_cryptography";


export const register = async (payload: IUser) => {
    const emailExists = await User.findOne({ email: payload.email })

    if (emailExists) {
        throw new CustomError({ message: "Email already Exist", code: 400 })
    }

    const user = new User(payload);

    await user.save();

    const accessToken = createToken(user.id, '12m')
    const refreshToken = createToken(user.id, '30d')

    return {
        user: user.toObject({
            transform: (doc, ret) => {
                delete ret.password;
            }
        }),
        accessToken,
        refreshToken
    }
}


export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email })

    if (!user) throw new CustomError({ message: "incorrect credentials", code: 404 });

    if (!(await bcrypt.compare(password, user.password))) throw new CustomError({ message: "incorrect credentials", code: 404 });

    const accessToken = createToken(user.id, '12m')
    const refreshToken = createToken(user.id, '30d')

    return {
        user: user.toObject({
            transform: (doc, ret) => {
                delete ret.password;
            }
        }),
        accessToken,
        refreshToken
    }
}