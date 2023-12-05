import { Router } from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicDepartmentValidationSchemas } from './academicDepartment.validation';

const router = Router();

router.post(
  '/create-academic-department',
  requestValidator(
    AcademicDepartmentValidationSchemas.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.createAcademicDepartmentIntoDB,
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartmentFormDB);

router.get('/:id', AcademicDepartmentController.getSingleAcademicFacultyFormDB);

router.patch(
  '/:id',
  requestValidator(
    AcademicDepartmentValidationSchemas.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
