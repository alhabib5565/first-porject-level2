import { Request, Response } from "express";
import { studnetService } from "./students.service";


const createStudent = async (req: Request, res: Response) => {
    try {
        const student = req.body.student
        const result = await studnetService.createStudentIntoDB(student)

        res.status(200).json({
            success: true,
            message: 'create student successfully',
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}

const getStudents = async (req: Request, res: Response) => {
    try {
        const result = await studnetService.getAllStudentsFormDB()
        res.status(200).json({
            success: true,
            message: 'Get students data',
            data: result
        })

    } catch (error) {
        console.log(error)
    }
}
const getAStudents = async (req: Request, res: Response) => {
    try {
        const id = req.params.studentId
        console.log(id)
        const result = await studnetService.getSingleStudentFromDB(id)
        res.status(200).json({
            success: true,
            message: 'Get single student data',
            data: result
        })

    } catch (error) {
        console.log(error)
    }
}

export const studentControllers = {
    createStudent,
    getStudents,
    getAStudents
}

