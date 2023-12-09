import { Router } from 'express';
import { UserControllers } from './user.controller';

import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from '../student/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';

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
router.post(
  '/create-admin',
  requestValidator(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
