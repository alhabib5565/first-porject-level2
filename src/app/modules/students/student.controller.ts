import { studnetService } from "./students.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
// const createStudent = async (req: Request, res: Response) => {
//     try {
//         const studentData = req.body.student
//         /*   validation using joi
//           const { error, value } = studentValidationSchema.validate(studentData)
//           console.log({ value: value }, { error: error })
//           if (error) {
//               return res.status(500).json({
//                   success: false,
//                   message: 'something went wrong',
//                   err: error
//               })
//           } */

//         // validation using ZOD
//         const zodParseData = StudentValidationSchema.parse(studentData)
//         console.log(zodParseData)
//         const result = await studnetService.createStudentIntoDB(zodParseData)
//         res.status(200).json({
//             success: true,
//             message: 'create student successfully',
//             data: result
//         })
//     } catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message || 'something went wrong',
//             err: err
//         })

//     }
// }


const getStudents = catchAsync(async (req, res) => {
    const result = await studnetService.getAllStudentsFormDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get students data',
        data: result
    })
})
const getAStudents = catchAsync(async (req, res) => {
    const id = req.params.studentId
    const result = await studnetService.getSingleStudentFromDB(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get single student data',
        data: result
    })
})

const deleteStudent = catchAsync(async (req, res) => {
    const studentId = req.params.studentId
    const result = studnetService.deleteStudnetFromDB(studentId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student deleted Successfull!',
        data: result
    })
})

export const studentControllers = {
    getStudents,
    getAStudents,
    deleteStudent
}

