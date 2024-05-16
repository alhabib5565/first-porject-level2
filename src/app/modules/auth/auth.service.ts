import httpStatus from "http-status";
import AppError from "../../errors/appErrors";
import { User } from "../user/user.model";
import { TLoginUser, TPasswordChange } from "./auth.interface";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../../config";
import { hash } from "bcrypt";


const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistByCustomId(payload?.id)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found')
    }

    const userStatus = user?.status
    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!')
    }

    const isUserDeleted = user?.isDeleted
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Deleted!')
    }

    const hashPassword = user.password
    const isPasswordMatched = await User.isPasswordMatched(payload?.password, hashPassword)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!')
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role
    }

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: '10d'
    })

    return {
        accessToken,
        needsPasswordChange: user?.needsPasswordChange,
    }
}

const changePasswordIntoDB = async (userData: JwtPayload, payload: TPasswordChange) => {
    const user = await User.isUserExistByCustomId(userData.userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found')
    }

    const userStatus = user?.status
    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!')
    }

    const isUserDeleted = user?.isDeleted
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is Deleted!')
    }

    const hashPassword = user.password
    const isPasswordMatched = await User.isPasswordMatched(payload.oldPassword, hashPassword)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!')
    }

    const newHashPassword = await hash(payload.newPassword, Number(config.bcrypt_salt_rounds))

    await User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role
    }, {
        password: newHashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    })


    return null
}

export const AuthServices = {
    loginUser,
    changePasswordIntoDB
}