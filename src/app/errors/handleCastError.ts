import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interface/error"

export const castValidationError = (err: mongoose.Error.CastError): TGenericErrorResponse => {

    const errorSource = [
        {
            path: err.path,
            message: err.message
        }
    ]
    const statusCode = 400
    return {
        statusCode,
        message: 'Invalid _id',
        errorSource
    }
}