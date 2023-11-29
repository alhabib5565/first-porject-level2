import config from "../../config";
import { Student } from "../students.model";
import { TStudent } from "../students/students.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";



const createStudentFmDB = async (password: string, studentData: TStudent) => {

    const user: Partial<TUser> = {}
    user.id = "202034342"
    user.role = 'student'
    if (!password) {
        user.password = config.password as string
    } else {
        user.password = password
    }

    const newUser = await User.create(user)

    if (Object.keys(newUser).length) {
        studentData.user = newUser._id
        studentData.id = newUser.id
        const student = await Student.create(studentData)
        return student
    }
}

export const userService = {
    createStudentFmDB
}