import { Router } from 'express';
import { AdminController } from './admin.controller';
import requestValidator from '../../middlewares/requestValidator';
import { adminValidations } from './admin.validation';

const router = Router();
router.get('/', AdminController.getAllAdmin);
router.get('/:id', AdminController.getSingleAdmin);
router.patch(
  '/:id',
  requestValidator(adminValidations.updateAdminValidationSchema),
  AdminController.updateAdmin,
);
router.delete('/:id', AdminController.deleteAdmin);

export const AdminRoutes = router;
