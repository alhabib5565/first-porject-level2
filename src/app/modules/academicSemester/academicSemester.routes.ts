import { Router } from "express";
import { academicSemesterController } from "./academicSemester.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createAcademicSemesterValidations } from "./academicSemester.validation";


const router = Router()

router.post(
    '/create-academic-semester',
    validateRequest(createAcademicSemesterValidations.createAcdemicSemesterValidationSchema), academicSemesterController.createAcademicSemester)

export const academicSemesterRouter = router