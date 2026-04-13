import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../../../constants/httpsConstants";

export interface AuthorizeOptions {
    hasRole: string[]
};

export const isAuthorized = ({hasRole} : AuthorizeOptions) => 
    (req: Request, res: Response, next: NextFunction): void => {
        const userRole = res.locals.role;

        if(!userRole) {
            next(
                new AppError("Forbidden: NO ROLE FOUND",
                HTTP_STATUS.FORBIDDEN
                )
            );
            return   
        }

        if(!hasRole.includes(userRole)) {
            next(
                new AppError("Forbidden: INSUFFICIENT ROLE",
                    HTTP_STATUS.FORBIDDEN
                )
            );
            return
        }

        next();
    };