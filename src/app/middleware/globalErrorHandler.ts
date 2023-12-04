/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';


// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500
    let message = err.message || 'something went wrong'

    type TerrorSources = {
        path: string | number,
        message: string
    }[]

    let errorSources: TerrorSources = [
        {
            path: '',
            message: ''
        }
    ]

    const zodError = (err: ZodError) => {
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

    if (err instanceof ZodError) {
        const simplifiedError = zodError(err)
        statusCode = simplifiedError.statusCode,
            message = simplifiedError.message
        errorSources = simplifiedError.errorSource
    }

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errorSources,
    })
}

export default globalErrorHandler
/* 
success: false,
statusCode : 400,
message: '',
errorSource: '[
    {
        path: '',
        message: ''
    }
]
*/
