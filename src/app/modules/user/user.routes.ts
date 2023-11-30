import express from 'express'
import { userController } from './user.controller'
import { createStudentValidationSchema } from '../students/student.zod.validation'
import { validateRequest } from '../../middleware/validateRequest'

const router = express.Router()


router.post('/create-student', validateRequest(createStudentValidationSchema), userController.createStudent)

export const userRouter = router