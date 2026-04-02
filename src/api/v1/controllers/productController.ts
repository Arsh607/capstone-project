import * as productServices from '../services/productServices';
import {Request, Response, NextFunction} from 'express';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const getAllProducts = await productServices.getAll();
        res.status(HTTP_STATUS.OK).json({
            message: 'Products retrieved successfully',
            count: getAllProducts.length,
            data: getAllProducts
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const id = Number(req.params.id);
        const getSpecificProduct = await productServices.getById(id);
        res.status(HTTP_STATUS.OK).json({
            message: 'Product retrieved successfully',
            data: getSpecificProduct
        });
    } catch (error) {
        next(error);
    }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const {name, description, price, quantity, category, supplierId} = req.body;
        const newProduct = await productServices.createProduct({name, description, price, quantity, category, supplierId});
        res.status(HTTP_STATUS.CREATED).json({
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const id = Number(req.params.id)
        const updatedProduct = await productServices.updateProduct(id, req.body);

        res.status(HTTP_STATUS.OK).json({
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const id = Number(req.params.id);
        const deletedProduct = await productServices.deleteProduct(id);

        res.status(HTTP_STATUS.OK).json({
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        next(error);
    }
};