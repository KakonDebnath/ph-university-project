import express from 'express';
import { StudentControllers } from './student.controller';
import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from './student.validation';

const router = express.Router();

router.get('/:studentId', StudentControllers.getSingleStudent);

router.patch(
  '/:studentId',
  requestValidator(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete('/:studentId', StudentControllers.deleteStudent);

router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;
