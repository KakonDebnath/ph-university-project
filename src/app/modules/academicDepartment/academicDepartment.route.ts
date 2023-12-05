import { Router } from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';

const router = Router();

router.post(
  '/create-academic-department',
  AcademicDepartmentController.createAcademicDepartmentIntoDB,
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartmentFormDB);

router.get('/:id', AcademicDepartmentController.getSingleAcademicFacultyFormDB);

router.patch('/:id', AcademicDepartmentController.updateAcademicDepartment);

export const AcademicDepartmentRoutes = router;
