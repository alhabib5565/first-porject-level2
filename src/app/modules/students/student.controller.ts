import { Request, Response } from "express";
import { studnetService } from "./students.service";
import StudentValidationSchema from "./student.zod.validation";
const createStudent = async (req: Request, res: Response) => {
    try {
        const studentData = req.body.student
        /*   validation using joi
          const { error, value } = studentValidationSchema.validate(studentData)
          console.log({ value: value }, { error: error })
          if (error) {
              return res.status(500).json({
                  success: false,
                  message: 'something went wrong',
                  err: error
              })
          } */

        // validation using ZOD
        const zodParseData = StudentValidationSchema.parse(studentData)
        console.log(zodParseData)
        const result = await studnetService.createStudentIntoDB(zodParseData)
        res.status(200).json({
            success: true,
            message: 'create student successfully',
            data: result
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            err: err
        })

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

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            err: err
        })
    }
}
const getAStudents = async (req: Request, res: Response) => {
    try {
        const id = req.params.studentId
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

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId
        const result = studnetService.deleteStudnetFromDB(studentId)
        res.status(200).json({
            success: true,
            message: 'delete student data',
            data: result
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            err: err
        })

    }
}

export const studentControllers = {
    createStudent,
    getStudents,
    getAStudents,
    deleteStudent
}

