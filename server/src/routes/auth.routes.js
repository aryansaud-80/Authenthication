import { Router } from 'express';
import {
  generateResetOtp,
  generateVerifyOtp,
  isUserAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/userAuth.controller.js';
import { jwtVerifyToken } from '../middlewares/auth.middlewares.js';

const router = Router();

router.route('/signup').post(register);
router.route('/login').post(login);
router.route('/logout').post(jwtVerifyToken, logout);
router.route('/generate-verify-otp').post(jwtVerifyToken, generateVerifyOtp);

router.route('/verify-email').post(jwtVerifyToken, verifyEmail);
router.route('/generate-reset-otp').post(generateResetOtp);
router.route('/reset-password').post(resetPassword);
router.route('/is-authenticated').get(jwtVerifyToken, isUserAuthenticated);

export default router;
