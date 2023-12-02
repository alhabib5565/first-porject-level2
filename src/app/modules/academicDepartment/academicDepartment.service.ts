import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";


const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload)
    return result
}

const getAllAcademicDepartmentsFromDB = async () => {
    const result = await AcademicDepartment.find()
    return result
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const result = AcademicDepartment.findById(id)
    return result
}

const updateAcademicDepartmentIntoDB = async (id: string, payload: Partial<TAcademicDepartment>) => {
    const result = AcademicDepartment.findOneAndUpdate({ _id: id }, payload)
    return result
}

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB
}