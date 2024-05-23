import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.conroller';

const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth('student'),
    validateRequest(
        EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
);


export const EnrolledCourseRoutes = router;