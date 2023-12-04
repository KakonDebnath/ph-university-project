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

router.get('/get-all-academic-semesters', AcademicSemesterControllers.getAllAcademicSemester)

export const AcademicSemesterRoutes = router;
