import { academicSemester } from "./academicSemesterModel";
import { TAcademicSemester } from "./academicSemster.interface";



const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    const result = await academicSemester.create(payload)
    return result
}

export const academicSemesterService = {
    createAcademicSemesterIntoDB
}