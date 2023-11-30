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

const getAllAcademicSemster = catchAsync(async (req: Request, res: Response) => {
    const result = await academicSemesterService.getAllAcademicSemsterIntoDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Fetched all academic semester succesfully',
        data: result,
    });
})
const getSingleAcademicSemster = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const result = await academicSemesterService.getSingleAcadiemcSemsterIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Fetched single academic semester succesfully',
        data: result,
    });
})

const updateAcademicSemster = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const semesterData = req.body
    const result = await academicSemesterService.updateAcademicSemesterIntoDB(id, semesterData)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Update academic semester succesfully',
        data: result,
    });
})

export const academicSemesterController = {
    createAcademicSemester,
    getAllAcademicSemster,
    getSingleAcademicSemster,
    updateAcademicSemster
}