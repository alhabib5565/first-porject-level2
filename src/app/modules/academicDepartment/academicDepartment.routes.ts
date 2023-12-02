import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";

const router = Router()

router.post(
    '/create-academic-department',
    validateRequest(AcademicDepartmentValidation.createAcademicDepartmentValidationSchema), AcademicDepartmentControllers.createAcademicDepartment
)
router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)
router.get('/:departmentId', AcademicDepartmentControllers.getSingleAcademicDepartment)
router.patch(
    '/:departmentId',
    validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema), AcademicDepartmentControllers.updateAcademicDeartment
)
export const AcademicDepartmentRoutes = router;