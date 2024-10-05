import { Request, Response } from "express";
import { login, register } from "../services/auth.s";

export const RegisterController = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await register(req.body);

    res.cookie('refresh_token', refreshToken,
        {
            httpOnly: true,
            sameSite: 'none',
            // secure: true
        })

    res.status(200).json({ data: { user, token: accessToken } })
}

export const LoginController = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await login(req.body.email, req.body.password);

    res.cookie('refresh_token', refreshToken,
        {
            httpOnly: true,
            sameSite: 'none',
            // secure: true,
            path: '/'
        })

    console.log('Cookie set:', res.getHeader('Set-Cookie'));

    res.status(200).json({ data: { user, token: accessToken } })
}
