import * as adminController from '../controllers/adminController';
import express, {Router} from 'express';
import { authenticate } from '../middleware/authenticate';
import { isAuthorized } from '../middleware/authorize';

const router: Router = express.Router();

router.post('/setCustomClaims', 
    authenticate, 
    isAuthorized({hasRole: ['admin']}),
    adminController.setCustomClaims
);

export default router;