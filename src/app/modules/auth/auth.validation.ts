import { z } from "zod";

const loginUserValidationSchema = z.object({
    id: z.string({
        required_error: 'Id is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    })
})
const passwordChangeValidationSchema = z.object({

    oldPassword: z.string({
        required_error: 'Old password is required'
    }),
    newPassword: z.string({
        required_error: 'New password is required'
    })
})

export const authValidations = {
    loginUserValidationSchema,
    passwordChangeValidationSchema
}