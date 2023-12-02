import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemesterModel";
import { Student } from "../students.model";
import { TStudent } from "../students/students.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import AppError from "../../errors/appErrors";
import httpStatus from "http-status";



const createStudentFmDB = async (password: string, payload: TStudent) => {

    const user: Partial<TUser> = {}

    user.role = 'student'
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
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

}

export const userService = {
    createStudentFmDB
}