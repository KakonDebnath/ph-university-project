import { Router } from 'express';
import { FacultyController } from './faculty.controller';
import requestValidator from '../../middlewares/requestValidator';
import { facultyValidations } from './faculty.validation';

const router = Router();
router.get('/', FacultyController.getAllFaculty);
router.get('/:id', FacultyController.getSingleFaculty);
router.patch(
  '/:id',
  requestValidator(facultyValidations.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);
router.delete('/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = router;
