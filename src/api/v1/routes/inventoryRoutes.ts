import express, { Router } from "express";
import * as inventoryController from '../controllers/inventoryController';

const router: Router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.deleteTransaction);

export default router;