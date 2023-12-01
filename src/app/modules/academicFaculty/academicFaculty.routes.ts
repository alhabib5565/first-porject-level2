import { Router } from "express";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";


const router = Router()

router.post(
    '/create-academic-faculty',
    validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema),
    AcademicFacultyControllers.createAcademicFaculty
)

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties)
router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty)
router.patch(
    '/:facultyId',
    validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema),
    AcademicFacultyControllers.updateAcademicFaculty
)

export const academicFacultyRouter = router