import mongoose from "mongoose";
import { Student } from "../students.model";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import AppError from "../../errors/appErrors";
import { TStudent } from "./students.interface";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";
// import { TStudent } from "./students.interface";


// const getAllStudentsFormDB = async (query: Record<string, unknown>) => {

//     let searchTerm = ''
//     console.log('base query', query)

//     if (query.studentTerm) {
//         searchTerm = query.studentTerm as string
//     }
//     const studentSearchableFields = ['email', 'name.firstName']
//     const searchQuery = Student.find({
//         $or: studentSearchableFields.map(filed => ({
//             [filed]: { $regex: searchTerm, $options: 'i' }
//         }))
//     })

//     const excludeFields = ['studentTerm', 'sort', 'limit', 'page', 'fileds']
//     const queryObj = { ...query }
//     excludeFields.forEach((el) => delete queryObj[el]);
//     console.log('object query', queryObj)

//     // filtering 
//     const filterQuery = searchQuery.find(queryObj)
//         .populate('admissionSemester')
//         .populate({
//             path: "academicDepartment",
//             populate: {
//                 path: "academicFaculty"
//             }
//         })

//     // SORTING FUNCTIONALITY:
//     let sort = '-gender'; // SET DEFAULT VALUE 

//     if (query.sort) {
//         sort = query.sort as string;
//     }

//     const sortQuery = filterQuery.sort(sort);

//     // limiting 
//     let limit = 1; // SET DEFAULT VALUE 
//     let page = 1
//     let skip = 0
//     if (query.limit) {
//         limit = Number(query.limit)
//     }

//     if (query.page) {
//         page = Number(query.page)
//         skip = (page - 1) * limit
//     }
//     const limitQuery = sortQuery.skip(skip).limit(limit)

//     let fileds = ''
//     if (query.fileds) {
//         fileds = (query.fileds as string).split(',').join(' ')
//     }

//     const selectQuery = limitQuery.select(fileds)

//     return selectQuery
// }

const getAllStudentsFormDB = async (query: Record<string, unknown>) => {

    const studentQuery = new QueryBuilder(Student.find()
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: "academicFaculty"
            }
        }), query)
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    // .populate('admissionSemester')
    //         .populate({
    //             path: "academicDepartment",
    //             populate: {
    //                 path: "academicFaculty"
    //             }
    //         })

    const result = await studentQuery?.modelQuery
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