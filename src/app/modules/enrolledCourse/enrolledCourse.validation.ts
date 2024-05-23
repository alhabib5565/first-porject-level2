import { z } from 'zod';

const createEnrolledCourseValidationZodSchema = z.object({
    offeredCourse: z.string(),
})

export const EnrolledCourseValidations = {
    createEnrolledCourseValidationZodSchema,
};