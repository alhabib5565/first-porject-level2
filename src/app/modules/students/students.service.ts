import { Student } from "../students.model";
// import { TStudent } from "./students.interface";

// const createStudentIntoDB = async (studentData: TStudent) => {
//     if (await Student.isStudentExists(studentData.id)) {
//         throw Error('student already exists custom static')
//     }
//     const result = await Student.create(studentData)
//     return result
// }

const getAllStudentsFormDB = async () => {
    const result = await Student.find()
    return result
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
    return result
}

const deleteStudnetFromDB = async (id: string) => {
    const result = await Student.updateOne({ id }, { isDeleted: true })
    return result
}

export const studnetService = {
    // createStudentIntoDB,
    getAllStudentsFormDB,
    getSingleStudentFromDB,
    deleteStudnetFromDB
}