import { z } from "zod";


const createAcademicDepartmentValidationSchema = z.object({
    name: z.string({
        invalid_type_error: "Academic department name must be string",
        required_error: 'Academic department name is required'
    }),
    academicFaculty: z.string({
        invalid_type_error: "Academic faculty must be string",
        required_error: 'Academic faculty is required'
    })
})


const updateAcademicDepartmentValidationSchema = z.object({
    name: z.string({
        invalid_type_error: "Academic department name must be string",
        required_error: 'Academic department name is required'
    }).optional(),
    academicFaculty: z.string({
        invalid_type_error: "Academic faculty must be string",
        required_error: 'Academic faculty is required'
    }).optional()
})


export const AcademicDepartmentValidation = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema
}