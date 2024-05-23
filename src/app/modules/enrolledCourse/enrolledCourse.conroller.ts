import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { EnrolledCourseService } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const userId = req?.user?.userId

    const result = await EnrolledCourseService.createEnrolledCourseIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is enrolled succesfully',
        data: result,
    });
});


export const EnrolledCourseControllers = {
    createEnrolledCourse,
};