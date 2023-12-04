import { Router } from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  requestValidator(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

export const AcademicSemesterRoutes = router;
