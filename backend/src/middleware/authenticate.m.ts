import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError';
import User from '../models/User';
import { Token, verifyToken } from '../utils/token_cryptography';
import jwt from 'jsonwebtoken';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const bearer = req.headers.authorization;
  console.log(req.cookies)
  console.log(bearer)

  if (!bearer || !bearer.startsWith('Bearer')) {
    return next(
      new CustomError({ message: 'Unauthorized Access', code: 401, ctx: { data: 'invalid bearer token' } }),
    );
  }

  let accessToken = bearer.split('Bearer ')[1].trim();
  try {
    const accessPayload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken)

    if (accessPayload instanceof jwt.JsonWebTokenError) {
      return next(new CustomError({ message: 'access token invalid', code: 401, ctx: { data: 'invalid bearer token' } }))
    }

    const refreshPayload = await verifyToken(req.cookies.refresh_token)


    if (refreshPayload instanceof jwt.JsonWebTokenError) return next(new CustomError({ message: 'refresh token expired.', code: 403, ctx: { data: 'refresh token expired.' } }))

    const user = await User.findOne({ _id: refreshPayload.id }, { __v: 0, password: 0 })

    if (!user) {
      return next(new CustomError({ message: 'access token invalid.', code: 401, ctx: { data: 'invalid bearer token' } }))
    }

    req.user = user.toObject({
      transform: (doc, ret) => {
        delete ret.password;
      }
    })
    next()
  } catch (e) {
    next(new CustomError({ message: 'access token invalid', code: 401, ctx: { data: 'invalid bearer token' } }))
  }
}