import express, { NextFunction, Request, Response } from 'express'
import { userController } from './user.controller'
import { AnyZodObject } from 'zod'
import { createStudentValidationSchema } from '../students/student.zod.validation'

const router = express.Router()

const shenabahini = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body)
            next()
        } catch (err) {
            next(err)
        }
    }

}
router.post('/create-student', shenabahini(createStudentValidationSchema), userController.createStudent)

export const userRouter = router