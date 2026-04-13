import {auth} from '../../../config/firebaseConfig';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            throw new AppError("Unauthorized: NO TOKEN PROVIDED", HTTP_STATUS.UNAUTHORIZED);
        }

        if(!authHeader.startsWith("Bearer")) {
            throw new AppError("Unauthorized: INVALID TOKEN FORMAT" , HTTP_STATUS.UNAUTHORIZED);
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            throw new AppError("Unauthorized: MISSING TOKEN", HTTP_STATUS.UNAUTHORIZED);
        }

        const decodedToken = await auth.verifyIdToken(token);

        res.locals.uid = decodedToken.uid;
        res.locals.role = (decodedToken as any).role;
        
        next();
    } catch (error: unknown) {
        if (error instanceof AppError) {
            next(error);
        }

        next(
            new AppError("Unauthorized: INVALID TOKEN", HTTP_STATUS.UNAUTHORIZED)
        )
    }
};