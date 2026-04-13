import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpsConstants";
import { AppError } from "../utils/AppError";

export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params;

    try {
        if (!id || Array.isArray(id)) {
            throw new AppError(
                "Invalid user id",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const user: UserRecord = await auth.getUser(id);

        res.status(HTTP_STATUS.OK).json({
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};