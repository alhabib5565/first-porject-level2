import express from 'express'
import { userController } from './user.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { studentValidations } from '../students/student.zod.validation'

const router = express.Router()


router.post('/create-student', validateRequest(studentValidations.createStudentValidationSchema), userController.createStudent)

export const userRouter = router