import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { authValidations } from './auth.validation';
import { AuthController } from './auth.controller';
const router = express.Router()

router.post('/login',
    validateRequest(authValidations.loginUserValidationSchema),
    AuthController.loginUser);


export const AuthRoutes = router;