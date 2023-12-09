import { QueryBuilder } from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./courses.constant";
import { TCourse } from "./courses.interface";
import { Course } from "./courses.model";

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
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, remainingCourseData, {
        new: true,
        runValidators: true
    })
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        const delteePreRequisiteCourse = preRequisiteCourses
            .filter(preRequisiteCourse => preRequisiteCourse.course && preRequisiteCourse.isDeleted)
            .map(el => el.course)

        const newPreRequisiteCourse = preRequisiteCourses
            .filter(preRequisiteCourse => preRequisiteCourse.course && !preRequisiteCourse.isDeleted)

        const delet = await Course.findByIdAndUpdate(
            id,
            { $pull: { preRequisiteCourses: { course: { $in: delteePreRequisiteCourse } } } },
            { updateBasicCourseInfo })

        const add = await Course.findByIdAndUpdate(
            id,
            {
                $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourse } }
            },
            {
                updateBasicCourseInfo
            })

        return { delet, add }
    }
    // return ;
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