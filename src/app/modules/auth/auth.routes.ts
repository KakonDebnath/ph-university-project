import { Router } from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = Router();

router.post(
  '/login',
  requestValidator(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/changePassword',
  // requestValidator(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
