import { ZodError, ZodIssue } from "zod"
import { TerrorSources } from "../interface/error"

export const zodError = (err: ZodError) => {
    const errorSource: TerrorSources = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue.message
        }
    })

    const statusCode = 400
    return {
        statusCode,
        message: 'validation error',
        errorSource: errorSource
    }
}