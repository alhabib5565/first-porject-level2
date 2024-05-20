/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemesterModel";
import { Student } from "../students.model";
import { TStudent } from "../students/students.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/appErrors";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { Faculty } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import { USER_ROLE } from "./user.constant";



const createStudentIntoDB = async (password: string, payload: TStudent) => {

    const user: Partial<TUser> = {}

    user.role = 'student'
    user.email = payload.email
    if (!password) {
        user.password = config.password as string
    } else {
        user.password = password
    }
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester)
    if (!admissionSemester) {
        throw Error("Faild to create user")
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        user.id = await generateStudentId(admissionSemester)
        // create a user (transaction-1)
        const newUser = await User.create([user], { session })
        // console.log(newUser)
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
        }
        payload.user = newUser[0]._id
        payload.id = newUser[0].id
        // create student
        const student = await Student.create([payload], { session })
        if (!student.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student')
        }


        await session.commitTransaction()
        await session.endSession()

        return student
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error?.message || 'Failed to create student');
    }

}


const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
    const user: Partial<TUser> = {}
    user.role = 'faculty'
    user.email = payload.email

    if (!password) {
        user.password = config.password as string
    } else {
        user.password = password
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        user.id = await generateFacultyId()
        // create a user (transaction-1)
        const newUser = await User.create([user], { session })
        // console.log(newUser)
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
        }
        payload.user = newUser[0]._id
        payload.id = newUser[0].id
        // create student
        const faculty = await Faculty.create([payload], { session })
        // console.log(faculty)
        if (!faculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
        }


        await session.commitTransaction()
        await session.endSession()

        return faculty
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }
}

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
    const user: Partial<TUser> = {}
    // console.log(password, payload)
    user.role = 'admin'
    user.email = payload.email

    if (!password) {
        user.password = config.password as string
    } else {
        user.password = password
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        user.id = await generateAdminId()

        const newUser = await User.create([user], { session })

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'user create failed')
        }
        payload.user = newUser[0]._id
        payload.id = newUser[0].id

        const admin = await Admin.create([payload], { session })
        if (!admin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'admin create failed')
        }

        await session.commitTransaction()
        session.endSession()

        return admin
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new AppError(httpStatus.BAD_REQUEST, 'admin create failed')
    }
}


const getMe = async (userId: string, role: string) => {
    console.log(userId)
    let result = null
    if (role === USER_ROLE.admin) {
        result = await Admin.findOne({ id: userId })
    }
    if (role === USER_ROLE.faculty) {
        result = await Faculty.findOne({ id: userId, })
    }
    if (role === USER_ROLE.student) {
        result = await Student.findOne({ id: userId })
    }
    return result
}

export const userService = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe
}