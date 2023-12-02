import mongoose from "mongoose";
import { Student } from "../students.model";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import AppError from "../../errors/appErrors";
import { TStudent } from "./students.interface";
// import { TStudent } from "./students.interface";


const getAllStudentsFormDB = async () => {
    const result = await Student.find()
        .populate('admissionSemester')
        .populate({
            path: "academicDepartment",
            populate: {
                path: "academicFaculty"
            }
        })
    return result
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
    return result
}

const deleteStudnetFromDB = async (id: string) => {
    const session = await mongoose.startSession()
    try {

        session.startTransaction()
        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        )

        // user delete
        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
        }
        const userDelete = await User.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        )

        if (!userDelete) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user")
        }

        await session.commitTransaction()
        await session.endSession()
        return deletedStudent

    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete user')
        throw new Error('Failed to delete student');
    }

}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData
    }

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    console.log(modifiedUpdatedData);


    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData)
    return result
}
export const studnetService = {
    getAllStudentsFormDB,
    getSingleStudentFromDB,
    deleteStudnetFromDB,
    updateStudentIntoDB
}