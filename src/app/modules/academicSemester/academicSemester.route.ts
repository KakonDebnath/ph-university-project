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

router.get(
  '/',
  AcademicSemesterControllers.getAllAcademicSemesterFromDB,
);

router.get('/:id', AcademicSemesterControllers.getSingleSemesterFromDB);

router.patch('/:semesterId', requestValidator(AcademicSemesterValidations.updateAcademicSemesterSchema), AcademicSemesterControllers.updateAcademicSemester);

export const AcademicSemesterRoutes = router;
