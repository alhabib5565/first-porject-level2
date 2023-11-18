
import express from 'express'
import { studentControllers } from './student.controller'

const router = express.Router()

router.post('/create-student', studentControllers.createStudent)
router.get('/', studentControllers.getStudents)
router.get('/:studentId', studentControllers.getAStudents)

export const studentRoutes = router