/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { TGenericErrorResponse, TerrorSources } from '../interface/error';
import { zodError } from '../errors/handleZodError';
import { mongooseValidationError } from '../errors/handleMongooseError';
import { castValidationError } from '../errors/handleCastError';
import { handleDuplicateError } from '../errors/handleDuplicateError';
import AppError from '../errors/appErrors';


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
    const generalErrorResponse = (simplifiedError: TGenericErrorResponse) => {
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSource
    }

    if (err instanceof ZodError) {
        const simplifiedError = zodError(err)
        generalErrorResponse(simplifiedError)
        // statusCode = simplifiedError.statusCode
        // message = simplifiedError.message
        // errorSources = simplifiedError.errorSource
    } else if (err.name === "ValidationError") {
        const simplifiedError = mongooseValidationError(err)
        generalErrorResponse(simplifiedError)
        // statusCode = simplifiedError.statusCode
        // message = simplifiedError.message
        // errorSources = simplifiedError.errorSource
    } else if (err.name === 'CastError') {
        const simplifiedError = castValidationError(err)
        generalErrorResponse(simplifiedError)
        // statusCode = simplifiedError.statusCode
        // message = simplifiedError.message
        // errorSources = simplifiedError.errorSource
    } else if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        generalErrorResponse(simplifiedError)
        // statusCode = simplifiedError.statusCode
        // message = simplifiedError.message
        // errorSources = simplifiedError.errorSource
    } else if (err instanceof AppError) {
        statusCode = err?.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    } else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
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

