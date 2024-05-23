import httpStatus from "http-status";
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface"
import AppError from "../../errors/appErrors";
import { Student } from "../students.model";
import EnrolledCourse from "./enrolledCourse.model";
import { startSession } from "mongoose";

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {

    const { offeredCourse } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full !');
    }

    const student = await Student.findOne({ id: userId }, { _id: 1 });

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
    }
    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse,
        student: student._id,
    });

    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !');
    }
    const session = await startSession()
    try {
        session.startTransaction()
        const result = await EnrolledCourse.create([{
            semesterRegistration: isOfferedCourseExists.semesterRegistration,
            academicSemester: isOfferedCourseExists.academicSemester,
            academicFaculty: isOfferedCourseExists.academicFaculty,
            academicDepartment: isOfferedCourseExists.academicDepartment,
            offeredCourse: offeredCourse,
            course: isOfferedCourseExists.course,
            student: student._id,
            faculty: isOfferedCourseExists.faculty,
        }], { session: session })

        if (!result) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to enroll in this cousre !',
            );
        }
        await OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: isOfferedCourseExists.maxCapacity - 1
        }, { session })

        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()

    }
}

export const EnrolledCourseService = {
    createEnrolledCourseIntoDB
}