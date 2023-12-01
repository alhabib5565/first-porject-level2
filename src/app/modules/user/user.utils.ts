import { TAcademicSemester } from "../academicSemester/academicSemster.interface";
import { User } from "./user.model";

const findLastStudentId = async () => {
    const lastUserId = await User.findOne(
        {
            role: "student"
        },
        {
            id: 1,
            _id: 0
        })
        .sort({ createdAt: -1 })
        .lean()

    return lastUserId?.id ? lastUserId.id : undefined
}


export const generateStudentId = async (payload: TAcademicSemester) => {
    // first time 0000
    //0001  => 1
    let currentId = (0).toString();
    const lastStudentId = await findLastStudentId()
    const lastStudentAdmissionYear = lastStudentId?.substring(0, 4)
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6)
    const currentStudentYear = payload.year
    const currentStudentSemesterCode = payload.code

    if (lastStudentId
        && lastStudentAdmissionYear === currentStudentYear
        && lastStudentSemesterCode === currentStudentSemesterCode) {
        currentId = lastStudentId.substring(6)
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
};