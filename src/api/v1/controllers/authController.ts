import {Request, Response, NextFunction} from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const {email, password} = req.body;

        if (!email) {
            throw new AppError("Bad Request: Email is required",
                                HTTP_STATUS.BAD_REQUEST)
        }
        if (!password) {
            throw new AppError("Bad Request: Password is required",
                                HTTP_STATUS.BAD_REQUEST)
        }
        if (!process.env.API_KEY) {
            throw new AppError("Server configuration error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const firebaseResponse = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        );

        const data = await firebaseResponse.json();

        if(!firebaseResponse.ok) {
            throw new AppError("Unauthorized: Sign in failed",
                                HTTP_STATUS.UNAUTHORIZED
            )
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Sign in successful",
            data: {
                idToken: data.idToken,
                email: data.email,
                localId: data.localId,
                expiresIn: data.expiresIn,
                refreshToken: data.refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};