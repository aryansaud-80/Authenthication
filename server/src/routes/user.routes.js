import { Router } from 'express';
import { jwtVerifyToken } from '../middlewares/auth.middlewares.js';
import { getUserData } from '../controllers/userData.controller.js';

const router = Router();

router.route('/get-user-data').get(jwtVerifyToken, getUserData);

export default router;
