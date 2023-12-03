import { Router } from 'express';
import { UserControllers } from './user.controller';
import { createStudentValidationSchema } from '../student/student.validation';
import requestValidator from '../../middlewares/requestValidator';

const router = Router();

router.post(
  '/create-student',
  requestValidator(createStudentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
