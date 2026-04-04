import express, { Router } from "express";
import * as productController from '../controllers/productController';

const router: Router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.deleteProduct);

export default router;