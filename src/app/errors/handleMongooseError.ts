import mongoose from "mongoose"
import { TGenericErrorResponse, TerrorSources } from "../interface/error"


export const mongooseValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
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