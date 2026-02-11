import { Router } from 'express';
import * as userController from '../../controllers/userController.js';
import {
  createUserValidation,
  rejectUnknownFields,
  handleValidationErrors,
} from '../../middlewares/validateCreateUser.js';

const router = Router();

router.post(
  '/',
  rejectUnknownFields,
  createUserValidation,
  handleValidationErrors,
  userController.createUser
);

export default router;
