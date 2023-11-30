import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { academicSemesterService } from "./academicSemester.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";


const createAcademicSemester = catchAsync(async (req: Request, res: Response) => {
    const result = await academicSemesterService.createAcademicSemesterIntoDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is created succesfully',
        data: result,
    });
})

export const academicSemesterController = {
    createAcademicSemester
}