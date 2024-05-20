import { NextFunction, Request, Response } from "express"
import AppError from "../errors/appErrors"
import httpStatus from "http-status"
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import catchAsync from "../../utils/catchAsync";
import { TUSER_ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";


export const auth = (...requiredRoles: TUSER_ROLE[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization

        if (!token) {
            throw new AppError(httpStatus.NOT_FOUND, 'You are not authorized')
        }

        const decode = jwt.verify(token, config.access_secret as string) as JwtPayload

        const { role, userId, iat } = decode

        const user = await User.isUserExistByCustomId(userId)
        if (user.status === 'blocked') {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized')
        }

        if (user.isDeleted) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized')
        }

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized')
        }

        if (user.passwordChangedAt && User.isJwtIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized')
        }

        req.user = decode as JwtPayload
        next()

    })
}