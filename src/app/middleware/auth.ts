import { NextFunction, Request, Response } from "express"
import AppError from "../errors/appErrors"
import httpStatus from "http-status"
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";


export const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized')
        }

        jwt.verify(token, config.secret as string, function (err, decode) {
            if (err) {
                throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized')
            }
            req.user = decode as JwtPayload
            next()
        })
    }
}