import express, { Router } from "express";
import * as productController from '../controllers/productController';
import { createProductValidation, updateProductValidation, productIdValidation } from "../validation/productValidation";
import { validateBody, validateParams } from "../middleware/validation";
import { getProductById } from "../repositories/productRepository";


const router: Router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', validateParams(productIdValidation), productController.getById);
router.post('/', validateBody(createProductValidation),productController.create);
router.put('/:id', 
    validateParams(productIdValidation), 
    validateBody(updateProductValidation), 
    productController.update);
router.delete('/:id', validateParams(productIdValidation), productController.deleteProduct);

export default router;