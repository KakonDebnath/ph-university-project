import { Router } from 'express';
import { UserControllers } from './user.controller';
import { studentValidationSchema } from '../student/student.validation';
import requestValidator from '../../middlewares/requestValidator';

const router = Router();

router.post(
  '/create-student',
  requestValidator(studentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
