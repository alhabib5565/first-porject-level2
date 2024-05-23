import httpStatus from "http-status";
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface"
import AppError from "../../errors/appErrors";
import { Student } from "../students.model";
import EnrolledCourse from "./enrolledCourse.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Course } from "../courses/courses.model";
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

    // check total credits exceeds maxCredit
    const course = await Course.findById(isOfferedCourseExists.course);
    const currentCredit = course?.credits;

    const semesterRegistration = await SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit')
    const maxCredit = semesterRegistration?.maxCredit


    const enrolledCoursesCredit = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                student: student._id
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData'
            }
        },
        {
            $unwind: '$enrolledCourseData'
        },
        {
            $project: { "enrolledCourseData.credits": 1 }
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' }
            }
        }
    ])

    const totalCredits =
        enrolledCoursesCredit.length > 0 ? enrolledCoursesCredit[0].totalEnrolledCredits : 0;

    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have exceeded maximum number of credits !',
        );
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