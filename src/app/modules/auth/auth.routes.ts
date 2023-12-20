import { Router } from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/login',
  requestValidator(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/changePassword',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  requestValidator(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);
router.post(
  '/refreshToken',
  requestValidator(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);
router.post(
  '/forgetPassword',
  requestValidator(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

export const AuthRoutes = router;
