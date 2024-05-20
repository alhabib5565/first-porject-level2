import { Request, Response } from "express"
import { AuthServices } from "./auth.service"
import catchAsync from "../../../utils/catchAsync"
import sendResponse from "../../../utils/sendResponse"
import httpStatus from "http-status"
import AppError from "../../errors/appErrors"


const loginUser = catchAsync(async (req: Request, res: Response) => {

    const { refreshToekn, accessToken, needsPasswordChange } = await AuthServices.loginUser(req.body)
    res.cookie('refreshToken', refreshToekn, {
        httpOnly: true
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in succesfull",
        data: {
            accessToken,
            needsPasswordChange
        }
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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const result = await AuthServices.refreshToken(refreshToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access token is retrieved successfully!",
        data: result
    })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.body.id
    const result = await AuthServices.forgetPassword(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reset password link genareted successfully!",
        data: result
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req?.headers?.authorization

    if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, 'something went wrong')
    }

    const result = await AuthServices.resetPassword(req.body, token)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reset password successfully!",
        data: result
    })
})

export const AuthController = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
}