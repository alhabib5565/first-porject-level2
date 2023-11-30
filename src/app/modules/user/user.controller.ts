import { userService } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";



const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body
    // const zodParseData = StudentValidationSchema.parse(studentData)
    //         console.log(zodParseData)
    const result = await userService.createStudentFmDB(password, student)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created succesfully',
        data: result,
    });
})

export const userController = {
    createStudent
}