import httpStatus from "http-status";
import AppError from "../../errors/appErrors";
import { User } from "../user/user.model";
import { TLoginUser, TPasswordChange } from "./auth.interface";
import { JwtPayload } from 'jsonwebtoken';
import config from "../../config";
import { hash } from "bcrypt";
import { createToekn } from "./auth.utils";
import jwt from 'jsonwebtoken'
import { sendMail } from "../../../utils/sendMail";

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

    const accessToken = createToekn({
        jwtPayload,
        secret: config.access_secret as string,
        expiresIn: config.jwt_access_expires_in as string
    })

    const refreshToekn = createToekn({
        jwtPayload,
        secret: config.refresh_secret as string,
        expiresIn: config.jwt_refresh_expires_in as string
    })

    return {
        accessToken,
        refreshToekn,
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

const refreshToken = async (token: string) => {
    const decode = jwt.verify(token, config.refresh_secret as string) as JwtPayload
    const { userId, iat } = decode;

    // checking if the user is exist
    const user = await User.isUserExistByCustomId(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
        user.passwordChangedAt &&
        User.isJwtIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToekn({
        jwtPayload,
        secret: config.access_secret as string,
        expiresIn: config.jwt_access_expires_in as string,
    });

    return {
        accessToken,
    };

}

const forgetPassword = async (id: string) => {
    // checking if the user is exist
    const user = await User.isUserExistByCustomId(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const resetToken = createToekn({
        jwtPayload,
        secret: config.access_secret as string,
        expiresIn: '10m'
    });

    const resetLink = `https://localhost:3000/auth/forget-password?id=${user.id}&token=${resetToken}`
    sendMail(user.email, resetLink)

    return resetLink

}

const resetPassword = async (payload: { id: string, newPassword: string }, token: string) => {
    const decode = jwt.verify(token, config.access_secret as string) as JwtPayload
    const { userId } = decode;
    console.log(decode)
    // checking if the user is exist
    const user = await User.isUserExistByCustomId(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }
    if (payload.id !== decode.userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Forbidden requiest!');
    }

    const newHashPassword = await hash(payload.newPassword, Number(config.bcrypt_salt_rounds))
    await User.findOneAndUpdate({
        id: decode.userId,
        role: decode.role
    }, {
        password: newHashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    })

}

export const AuthServices = {
    loginUser,
    changePasswordIntoDB,
    refreshToken,
    forgetPassword,
    resetPassword
}