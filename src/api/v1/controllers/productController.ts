import * as productServices from '../services/productServices';
import {Request, Response, NextFunction} from 'express';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const getAllProducts = await productServices.getAll();
        res.status(HTTP_STATUS.OK).json({
            message: 'Products retrieved',
            count: getAllProducts.length,
            data: getAllProducts
        });
    } catch (error) {
        next(error);
    }
};