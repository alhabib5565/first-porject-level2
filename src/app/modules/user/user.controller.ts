import { userService } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";



const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body
    // const zodParseData = StudentValidationSchema.parse(studentData)
    //         console.log(zodParseData)
    const result = await userService.createStudentIntoDB(req.file, password, student)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created succesfully',
        data: result,
    });
})

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty } = req.body
    const result = await userService.createFacultyIntoDB(password, faculty)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is created succesfully',
        data: result,
    });
})
const createAdmin = catchAsync(async (req, res) => {
    const { password, admin } = req.body
    // console.log(password, admin)
    const result = await userService.createAdminIntoDB(password, admin)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin is created succesfully',
        data: result,
    });
})
const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user

    const result = await userService.getMe(userId, role)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get me succesfully',
        data: result,
    });
})

export const userController = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe
}