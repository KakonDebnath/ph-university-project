import { Router } from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import requestValidator from '../../middlewares/requestValidator';
import { academicFacultyValidations } from './academicFaculty.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-academic-faculty',
  requestValidator(
    academicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFacultyIntoDB,
);

router.get('/', auth(), AcademicFacultyControllers.getAllAcademicFacultyFormDB);

router.get(
  '/:facultyId',
  AcademicFacultyControllers.getSingleAcademicFacultyFormDB,
);

router.patch(
  '/:facultyId',
  requestValidator(
    academicFacultyValidations.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
