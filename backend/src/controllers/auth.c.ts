import { Request, Response } from "express";
import { login, register, refreshToken } from "../services/auth.s";

export const RegisterController = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await register(req.body);

    res.cookie('refresh_token', refreshToken,
        {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

    res.status(200).json({ data: { user, token: accessToken } })
}

export const LoginController = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await login(req.body.email, req.body.password);

    res.cookie('refresh_token', refreshToken,
        {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            // path: '/'
        })

    res.status(200).json({ data: { user, token: accessToken } })
}


export const RefreshTokenController = async (req: Request, res: Response) => {
    const refresh_token = req.cookies?.refresh_token ? req.cookies.refresh_token : ''
    const tokens = await refreshToken(refresh_token)

    res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })

    res.status(200).json({ data: { token: tokens.access_token }, statusCode: 200 })
}
