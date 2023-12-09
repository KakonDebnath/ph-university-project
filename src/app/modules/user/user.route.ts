import { Router } from 'express';
import { UserControllers } from './user.controller';

import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from '../student/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';

const router = Router();

router.post(
  '/create-student',
  requestValidator(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  requestValidator(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

export const UserRoutes = router;
