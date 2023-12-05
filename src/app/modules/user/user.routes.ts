import express from 'express'
import { userController } from './user.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { studentValidations } from '../students/student.zod.validation'
import { facultyValidations } from '../faculty/faculty.validation'

const router = express.Router()


router.post('/create-student', validateRequest(studentValidations.createStudentValidationSchema), userController.createStudent)
router.post('/create-faculty', validateRequest(facultyValidations.createFacultyValidationSchema), userController.createFaculty)

export const userRouter = router