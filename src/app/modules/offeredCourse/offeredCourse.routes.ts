import express from 'express';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import requestValidator from '../../middlewares/requestValidator';


const router = express.Router();

// router.get('/', OfferedCourseControllers.getAllOfferedCourses);

// router.get('/:id', OfferedCourseControllers.getSingleOfferedCourses);

router.post(
  '/create-offered-course',
  requestValidator(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// router.patch(
//   '/:id',
//   validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
//   OfferedCourseControllers.updateOfferedCourse,
// );

// router.delete(
//   '/:id',
//   OfferedCourseControllers.deleteOfferedCourseFromDB,
// );

export const OfferedCourseRoutes = router;