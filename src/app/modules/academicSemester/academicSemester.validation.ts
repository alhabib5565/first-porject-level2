
import { z } from 'zod'
import { AcademicSemesterCode, AcademicSemesterMonths, AcademicSemesterName } from './academicSemster.constant'

const createAcdemicSemesterValidationSchema = z.object({
    // name: z.enum([...AcademicSemesterName] as [TAcademicSemesterName])
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
    startMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]),
    endMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]),
})
const updateAcademicSemesterValidationSchema = z.object({
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]).optional(),
    year: z.string().optional(),
    code: z.enum([...AcademicSemesterCode] as [string, ...string[]]).optional(),
    startMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]).optional(),
    endMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]).optional(),
});
export const createAcademicSemesterValidations = {
    createAcdemicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema
};