import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";



const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, student } = req.body

        const result = await userService.createStudentFmDB(password, student)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Student is created succesfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
}

export const userController = {
    createStudent
}