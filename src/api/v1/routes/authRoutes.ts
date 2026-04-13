import * as authController from '../controllers/authController';
import express, {Router} from 'express';

const router: Router = express.Router();

router.post('/signIn', authController.signIn);

export default router;