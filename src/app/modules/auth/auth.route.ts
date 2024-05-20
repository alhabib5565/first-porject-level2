import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { authValidations } from './auth.validation';
import { AuthController } from './auth.controller';
import { auth } from '../../middleware/auth';
const router = express.Router()

router.post('/login',
    validateRequest(authValidations.loginUserValidationSchema),
    AuthController.loginUser
);
router.post(
    '/refresh-token',
    AuthController.refreshToken
)
router.post(
    '/change-password',
    auth('admin', 'faculty', 'student'),
    validateRequest(authValidations.passwordChangeValidationSchema),
    AuthController.changePassword
)
router.post(
    '/forget-password',
    validateRequest(authValidations.forgetPasswordValidationSchema),
    AuthController.forgetPassword
)
router.post(
    '/reset-password',
    validateRequest(authValidations.resetPasswordValidationSchema),
    AuthController.resetPassword
)


export const AuthRoutes = router;