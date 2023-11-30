import { AcademicSemester } from "./academicSemesterModel";
import { academicSemesterNameCodeMapper } from "./academicSemster.constant";
import { TAcademicSemester } from "./academicSemster.interface";



const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw Error('Invalid code')
    }
    const result = await AcademicSemester.create(payload)
    return result
}

const getAllAcademicSemsterIntoDB = async () => {
    const result = await AcademicSemester.find()
    return result
}

const getSingleAcadiemcSemsterIntoDB = async (id: string) => {
    const result = await AcademicSemester.findById(id)
    return result
}

const updateAcademicSemesterIntoDB = async (id: string, userData: Partial<TAcademicSemester>) => {
    if (
        userData.name &&
        userData.code &&
        academicSemesterNameCodeMapper[userData.name] !== userData.code
    ) {
        throw new Error('Invalid Semester Code');
    }
    const result = await AcademicSemester.findOneAndUpdate({ _id: id }, userData, {
        new: true,
        runValidators: true
    })
    return result
}

export const academicSemesterService = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemsterIntoDB,
    getSingleAcadiemcSemsterIntoDB,
    updateAcademicSemesterIntoDB
}