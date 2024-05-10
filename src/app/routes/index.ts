import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { studentRoutes } from "../modules/students/students.routes";
import { academicSemesterRouter } from "../modules/academicSemester/academicSemester.routes";
import { academicFacultyRouter } from "../modules/academicFaculty/academicFaculty.routes";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { FacultyRoutes } from "../modules/faculty/faculty.routes";
import { CourseRoutes } from "../modules/courses/courses.routes";
import { semesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { offeredCourseRoutes } from "../modules/OfferedCourse/OfferedCourse.route";
import { AuthRoutes } from "../modules/auth/auth.route";


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
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: '/faculties',
        route: FacultyRoutes,
    },
    {
        path: '/courses',
        route: CourseRoutes,
    },
    {
        path: '/semester-registrations',
        route: semesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: offeredCourseRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
]

modules.forEach(route => router.use(route.path, route.route))
// router.use('/students', studentRoutes);
// router.use('/users', userRouter)


export default router