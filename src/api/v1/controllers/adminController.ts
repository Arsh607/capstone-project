import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpsConstants";
import {auth} from '../../../config/firebaseConfig';
import { AppError } from "../utils/AppError";

export const setCustomClaims = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const {uid, role} = req.body;
        
        if(!uid) {
            throw new AppError("Bad Request: uid is required",
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if(!role) {
            throw new AppError("Bad Request: role is required",
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if (!["admin", "manager", "employee", "guest"].includes(role)) {
            throw new AppError(
            "Bad Request: invalid role",
            HTTP_STATUS.BAD_REQUEST
            );
        }

        await auth.setCustomUserClaims(uid, {role});

        res.status(HTTP_STATUS.OK).json({
            message: "Role set successfully",
            data: {
                uid,
                role
            }
        });
    } catch (error) {
        next(error);
    }
};