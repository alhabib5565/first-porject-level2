/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { TerrorSources } from '../interface/error';
import { zodError } from '../errors/handleMongooseError';
import mongoose from 'mongoose';


// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500
    let message = err.message || 'something went wrong'


    let errorSources: TerrorSources = [
        {
            path: '',
            message: ''
        }
    ]

    const mongooseValidationError = (err: mongoose.Error.ValidationError) => {
        const errorSource: TerrorSources = Object.values(err.errors).map((val) => {
            return {
                path: val.path,
                message: val.message
            }
        })

        const statusCode = 500
        return {
            statusCode,
            message: 'validation error mon',
            errorSource
        }
    }

    if (err instanceof ZodError) {
        const simplifiedError = zodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSource
    } else if (err.name === "ValidationError") {
        const simplifiedError = mongooseValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSource
    }

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errorSources,
        err
        // stack: err
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
