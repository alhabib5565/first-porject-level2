import { Request, Response } from "express"
import { AuthServices } from "./auth.service"
import catchAsync from "../../../utils/catchAsync"
import sendResponse from "../../../utils/sendResponse"
import httpStatus from "http-status"


const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthServices.loginUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in succesfull",
        data: result
    })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.changePasswordIntoDB(req.user, req.body)
    sendResponse(res, {
        success: true,
        message: 'Password change succesfully',
        statusCode: httpStatus.OK,
        data: result
    })
})

export const AuthController = {
    loginUser,
    changePassword
}