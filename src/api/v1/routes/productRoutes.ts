import express, { Router } from "express";
import * as productController from '../controllers/productController';
import { createProductValidation, updateProductValidation } from "../validation/productValidation";
import { validateBody, validateParams } from "../middleware/validation";


const router: Router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.deleteProduct);

export default router;