import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import { UserControllers } from './user.controller';
import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from '../student/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudnary';

const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  requestValidator(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  requestValidator(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  requestValidator(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.post(
  '/change-status/:id',
  auth('admin'),
  requestValidator(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);
router.get(
  '/me',
  auth('admin', 'faculty', 'student'),
  UserControllers.getMeFromDB,
);

export const UserRoutes = router;
