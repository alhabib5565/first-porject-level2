import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemesterModel";
import { Student } from "../students.model";
import { TStudent } from "../students/students.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";



const createStudentFmDB = async (password: string, payload: TStudent) => {

    const user: Partial<TUser> = {}

    user.role = 'student'
    if (!password) {
        user.password = config.password as string
    } else {
        user.password = password
    }
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester)
    user.id = await generateStudentId(admissionSemester)


    const newUser = await User.create(user)
    if (Object.keys(newUser).length) {
        payload.user = newUser._id
        payload.id = newUser.id
        const student = await Student.create(payload)
        return student
    }
}

export const userService = {
    createStudentFmDB
}