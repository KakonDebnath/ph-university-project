import { Router } from 'express';
import { CourseController } from './course.controller';
import requestValidator from '../../middlewares/requestValidator';
import { CourseValidations } from './course.validations';
import auth from '../../middlewares/auth';

const router = Router();
router.post(
  '/create-course',
  auth('admin'),
  requestValidator(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getAllCourses);

router.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  CourseController.getSingleCourse,
);

router.patch(
  '/:id',
  auth('admin'),
  requestValidator(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);
router.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = router;
