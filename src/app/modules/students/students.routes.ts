
import express from 'express'
import { studentControllers } from './student.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { updateStudentValidationSchema } from './student.zod.validation'

const router = express.Router()

router.get('/', studentControllers.getAllStudents)
router.get('/:studentId', studentControllers.getAStudents)
router.delete('/:studentId', studentControllers.deleteStudent)
router.patch(
    '/:studentId',
    validateRequest(updateStudentValidationSchema),
    studentControllers.updateStudent)

export const studentRoutes = router