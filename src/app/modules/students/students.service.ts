import { StudentModel } from "../students.schema";
import { Student } from "./students.interface";

const createStudentIntoDB = async (student: Student) => {
    const result = await StudentModel.create(student)
    return result
}

const getAllStudentsFormDB = async () => {
    const result = await StudentModel.find()
    return result
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await StudentModel.findOne({ id })
    return result
}

export const studnetService = {
    createStudentIntoDB,
    getAllStudentsFormDB,
    getSingleStudentFromDB
}