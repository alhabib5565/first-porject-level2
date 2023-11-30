import { Router } from "express";
import { academicSemesterController } from "./academicSemester.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createAcademicSemesterValidations } from "./academicSemester.validation";


const router = Router()

router.post(
    '/create-academic-semester',
    validateRequest(createAcademicSemesterValidations.createAcdemicSemesterValidationSchema), academicSemesterController.createAcademicSemester)
router.get('/', academicSemesterController.getAllAcademicSemster)
router.get('/:id', academicSemesterController.getSingleAcademicSemster)
router.patch('/:id',
    validateRequest(createAcademicSemesterValidations.updateAcademicSemesterValidationSchema),
    academicSemesterController.updateAcademicSemster)

export const academicSemesterRouter = router