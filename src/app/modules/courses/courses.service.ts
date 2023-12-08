import { QueryBuilder } from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./courses.constant";
import { TCourse } from "./courses.interface";
import { Course } from "./courses.model";

const createCourseIntoDB = async (payload: TCourse) => {

    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate("preRequisiteCourses.course"), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await courseQuery.modelQuery
    return result
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id)
    return result;
};
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const result = await Course.findByIdAndUpdate(id, payload, {
        new: true
    })
    return result;
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    return result
}


export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB
}