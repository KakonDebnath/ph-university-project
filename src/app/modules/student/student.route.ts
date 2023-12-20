import express from 'express';
import { StudentControllers } from './student.controller';
import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  StudentControllers.getAllStudents,
);

router.get(
  '/:studentId',
  auth('admin', 'faculty', 'student'),
  StudentControllers.getSingleStudent,
);

router.patch(
  '/:studentId',
  requestValidator(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete('/:studentId', StudentControllers.deleteStudent);

export const StudentRoutes = router;
