
/**
 import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
    course: Types.ObjectId;
    isDeleted: boolean;
};

export type TCourse = {
    title: string;
    prefix: string;
    code: number;
    credits: number;
    isDeleted?: boolean;
    preRequisiteCourses: [TPreRequisiteCourses];
};
 */

import { z } from "zod";

const preRequisiteCoursesValidation = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
})

const createCourseValidationSchema = z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourses: z.array(preRequisiteCoursesValidation).optional()
})

const updateCourseValidationSchema = z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
        .array(preRequisiteCoursesValidation)
        .optional(),
    isDeleted: z.boolean().optional(),
})
// const updatePreRequisiteCourseValidationSchema = z.object({
//     course: z.string(),
//     isDeleted: z.boolean().optional(),
// });


export const CourseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
};