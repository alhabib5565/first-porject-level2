/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";


export type TUser = {
    id: string,
    password: string,
    needsPasswordChange: boolean,
    passwordChangedAt: Date
    role: 'admin' | 'faculty' | 'student',
    status: 'in-progress' | 'blocked'
    isDeleted: boolean,
}


export interface UserModel extends Model<TUser> {
    isUserExistByCustomId(id: string): Promise<TUser>
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;
}

export type TUSER_ROLE = keyof typeof USER_ROLE