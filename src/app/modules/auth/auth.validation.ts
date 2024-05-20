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

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});

const forgetPasswordValidationSchema = z.object({
    id: z.string({
        required_error: 'id is required'
    })
})

const resetPasswordValidationSchema = z.object({
    id: z.string({
        required_error: 'User id is required'
    }),
    newPassword: z.string({
        required_error: 'new password is required'
    })
})

export const authValidations = {
    loginUserValidationSchema,
    passwordChangeValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema
}