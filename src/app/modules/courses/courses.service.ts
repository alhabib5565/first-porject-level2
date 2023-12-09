import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./courses.constant";
import { TCourse, TCoursefaculty } from "./courses.interface";
import { Course, CourseFaculty } from "./courses.model";
import AppError from "../../errors/appErrors";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {

    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find(), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await courseQuery.modelQuery
    return result
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate("preRequisiteCourses.course")
    return result;
};
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...remainingCourseData } = payload
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, remainingCourseData, {
            new: true,
            runValidators: true,
            session
        })
        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'course update failed')
        }

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {

            //previous pre requisite courses
            const preRequisiteCourse = preRequisiteCourses
                .filter(preRequisiteCourse => preRequisiteCourse.course && preRequisiteCourse.isDeleted)
                .map(el => el.course)

            // new pre requisite courses 
            const newRequisiteCourse = preRequisiteCourses
                .filter(preRequisiteCourse => preRequisiteCourse.course && !preRequisiteCourse.isDeleted)

            // delete previous required courses
            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                { $pull: { preRequisiteCourses: { course: { $in: preRequisiteCourse } } } },
                {
                    new: true,
                    runValidators: true,
                    session
                })

            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'course update failed')
            }

            // add new required courses
            const addNewPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourses: { $each: newRequisiteCourse } }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                })

            if (!addNewPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'course update failed')
            }
            const result = await Course.findById(id).populate("preRequisiteCourses.course")
            return result
        }

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(httpStatus.BAD_REQUEST, 'course update failed')
    }
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    return result
}

const assignFacultiesWithCourseIntoDB = async (
    id: string,
    payload: Partial<TCoursefaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } },
        },
        {
            upsert: true,
            new: true,
        },
    );
    return result;
};


export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB
}