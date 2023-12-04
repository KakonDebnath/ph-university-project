import { Router } from 'express';
import { UserControllers } from './user.controller';

import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from '../student/student.validation';

const router = Router();

router.post(
  '/create-student',
  requestValidator(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
