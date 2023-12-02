import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { studentRoutes } from "../modules/students/students.routes";
import { academicSemesterRouter } from "../modules/academicSemester/academicSemester.routes";
import { academicFacultyRouter } from "../modules/academicFaculty/academicFaculty.routes";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.routes";



const router = Router()
const modules = [
    {
        path: '/students',
        route: studentRoutes
    },
    {
        path: '/users',
        route: userRouter
    },
    {
        path: '/academic-semester',
        route: academicSemesterRouter
    },
    {
        path: '/academic-faculty',
        route: academicFacultyRouter
    },
    {
        path: '/academic-department',
        route: AcademicDepartmentRoutes
    },
]

modules.forEach(route => router.use(route.path, route.route))
// router.use('/students', studentRoutes);
// router.use('/users', userRouter)


export default router