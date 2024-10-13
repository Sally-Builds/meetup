import User, { IUser } from "../models/User";
import { CustomError } from "../utils/customError";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createToken, verifyToken } from "../utils/token_cryptography";


export const register = async (payload: IUser) => {
    const emailExists = await User.findOne({ email: payload.email })
    const usernameExists = await User.findOne({ username: payload.username })

    if (emailExists) {
        throw new CustomError({ message: "Email already Exist", code: 400 })
    }

    if (usernameExists) {
        throw new CustomError({ message: "Username already Exist", code: 400 })
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

export const refreshToken = async (refresh_token: string) => {
    try {
        const decoded = await verifyToken(refresh_token)

        if (decoded instanceof jwt.JsonWebTokenError) {
            throw new CustomError({ message: 'refresh token invalid', code: 401, ctx: { data: 'invalid bearer token' } });
        }
        const user = await User.findOne({ _id: decoded.id })
        if (!user) {
            throw new CustomError({ message: 'refresh token invalid', code: 401, ctx: { data: 'invalid bearer token' } })
        }

        return {
            access_token: createToken(user.id, '12m'),
            refresh_token: createToken(user.id, '30d')
        }
    } catch (e) {
        throw new CustomError({ message: 'refresh token invalid', code: 401, ctx: { data: 'invalid bearer token' } })
    }
}