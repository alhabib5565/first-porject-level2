
import express from 'express'
import { studentControllers } from './student.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { updateStudentValidationSchema } from './student.zod.validation'
import { auth } from '../../middleware/auth'

const router = express.Router()

router.get(
    '/',
    auth('admin', 'faculty'),
    studentControllers.getAllStudents
)
router.get(
    '/:studentId',
    auth('admin', 'faculty'),
    studentControllers.getAStudents
)
router.delete(
    '/:studentId',
    auth('student', 'admin', 'faculty'),
    studentControllers.deleteStudent
)
router.patch(
    '/:studentId',
    auth('student', 'admin', 'faculty',),
    validateRequest(updateStudentValidationSchema),
    studentControllers.updateStudent
)

export const studentRoutes = router