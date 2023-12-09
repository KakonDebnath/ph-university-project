import { Router } from 'express';
import { CourseController } from './course.controller';
import requestValidator from '../../middlewares/requestValidator';
import { CourseValidations } from './course.validations';

const router = Router();
router.post(
  '/create-course',
  requestValidator(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getSingleCourse);
router.patch(
  '/:id',
  requestValidator(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);
router.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = router;
