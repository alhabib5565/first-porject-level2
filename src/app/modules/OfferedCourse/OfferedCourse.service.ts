import httpStatus from "http-status"
import AppError from "../../errors/appErrors"
import { TOfferedCourse } from "./OfferedCourse.interface"
import { OfferedCourse } from "./OfferedCourse.model"
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model"
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model"
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model"
import { Course } from "../courses/courses.model"
import { Faculty } from "../faculty/faculty.model"
import { haseConflict } from "./OfferdCourse.utils"


const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        faculty,
        section,
        days,
        endTime,
        startTime
    } = payload

    // check isSemesterRegistrationExist
    const isSemesterRegistrationExist = await SemesterRegistration.findById(semesterRegistration)

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, `Registration semester doesn't exist`)
    }
    const academicSemester = isSemesterRegistrationExist.academicSemester


    //check academic faculty exist 
    const isAcademicFacultyExist = await AcademicFaculty.findById(academicFaculty)

    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, `This academic faculty doesn't exist`)
    }


    //check academic Department exist
    const isAcademicDepartment = await AcademicDepartment.findById(academicDepartment)

    if (!isAcademicDepartment) {
        throw new AppError(httpStatus.NOT_FOUND, `This academic department doesn't exist`)
    }


    // check course exits
    const isCourseExits = await Course.findById(course);

    if (!isCourseExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
    }

    const isFacultyExits = await Faculty.findById(faculty);

    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    // check if the department is belong to the  faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This ${isAcademicDepartment.name} is not  belong to this ${isAcademicFacultyExist.name}`,
        );
    }


    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
        await OfferedCourse.findOne({
            semesterRegistration,
            course,
            section,
        });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Offered course with same section is already exist!`,
        );
    }




    const asignSchedule = await OfferedCourse.find({
        faculty,
        days: { $in: days }
    }).select('days startTime endTime')

    const newSchedule = {
        startTime,
        endTime
    }

    if (haseConflict(asignSchedule, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, 'already have a offered course at this time')
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester })
    return result
}

const getAllOfferedCoursesFromDB = async () => {
    const result = await OfferedCourse.find()
    return result
}

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id)
    return result
}

const deleteOfferedCourseFromDB = async (id: string) => {
    const isOfferedCourseExist = await OfferedCourse.findById(id)
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'This offerd course not found!!!')
    }

    const semesterRegistration = isOfferedCourseExist.semesterRegistration
    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration).select('status')

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not delete this offered course as it is ${semesterRegistrationStatus?.status}`,)
    }

    const result = await OfferedCourse.findByIdAndDelete(id)
    return result
}

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'days' | 'startTime' | 'endTime' | 'maxCapacity' | 'section' | 'faculty'>
) => {
    const { faculty, days, startTime, endTime, } = payload

    const isOfferedCourseExist = await OfferedCourse.findById(id)
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'This offerd course not found!!!')
    }

    const semesterRegistration = isOfferedCourseExist.semesterRegistration

    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration).select('status')

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }

    const isFacultyExits = await Faculty.findById(faculty);
    if (!isFacultyExits) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    const asignSchedule = await OfferedCourse.find({
        faculty,
        days: { $in: days }
    }).select('days startTime endTime')

    const newSchedule = {
        startTime,
        endTime
    }

    if (haseConflict(asignSchedule, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, 'already have a offered course at this time')
    }


    const result = await OfferedCourse.findByIdAndUpdate(id, payload)
    return result
}








export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    deleteOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
};