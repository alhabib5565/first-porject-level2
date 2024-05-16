import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { authValidations } from './auth.validation';
import { AuthController } from './auth.controller';
import { auth } from '../../middleware/auth';
const router = express.Router()

router.post('/login',
    validateRequest(authValidations.loginUserValidationSchema),
    AuthController.loginUser);
router.post('/change-password', auth(), validateRequest(authValidations.passwordChangeValidationSchema), AuthController.changePassword)


export const AuthRoutes = router;