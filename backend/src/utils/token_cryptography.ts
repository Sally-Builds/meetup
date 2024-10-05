import jwt from "jsonwebtoken";
import { config } from "./config";
export interface Token {
  id: string;
  expiresIn: number
}

export const createToken = (id: string, expires = '30d'): string => {
  return jwt.sign({ id }, config.jwtSecret as jwt.Secret, {
    expiresIn: expires
  })
}

export const verifyToken = async (token: string): Promise<jwt.VerifyErrors | Token> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, payload) => {
      if (err) return reject(err)

      resolve(payload as Token)
    })
  })
}

export default { verifyToken }
