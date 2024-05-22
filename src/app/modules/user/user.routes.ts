import express, { NextFunction, Request, Response } from 'express'
import { userController } from './user.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { studentValidations } from '../students/student.zod.validation'
import { facultyValidations } from '../faculty/faculty.validation'
import { AdminValidations } from '../admin/admin.validation'
import { auth } from '../../middleware/auth'
import { USER_ROLE } from './user.constant'
import { upload } from '../../../utils/sendImageTocloudinary'

const router = express.Router()


router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(studentValidations.createStudentValidationSchema),
    userController.createStudent
)
router.post(
    '/create-faculty',
    auth('admin'),
    validateRequest(facultyValidations.createFacultyValidationSchema),
    userController.createFaculty
)
router.post(
    '/create-admin',
    validateRequest(AdminValidations.createAdminValidationSchema),
    userController.createAdmin
)
router.get(
    '/get-me',
    auth('admin', 'faculty', 'student'),
    userController.getMe
)
export const userRouter = router