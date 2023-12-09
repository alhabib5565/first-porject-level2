import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseValidations } from './courses.validation';
import { CourseControllers } from './courses.controller';

const router = express.Router();

router.post(
    '/create-course',
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch(
    '/:id',
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
);
router.put(
    '/:courseId/assign-faculties',
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse,
);
router.put(
    '/:courseId/remove-faculties',
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse,
);
router.delete('/:id', CourseControllers.deleteCourse);


router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router;