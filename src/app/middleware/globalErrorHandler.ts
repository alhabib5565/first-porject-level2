/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';


// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = 500
    const message = err.message || 'something went wrong'
    return res.status(statusCode).json({
        success: false,
        message,
        errro: err
    })
}

export default globalErrorHandler


