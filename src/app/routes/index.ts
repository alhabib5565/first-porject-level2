import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { studentRoutes } from "../modules/students/students.routes";



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
]

modules.forEach(route => router.use(route.path, route.route))
// router.use('/students', studentRoutes);
// router.use('/users', userRouter)


export default router