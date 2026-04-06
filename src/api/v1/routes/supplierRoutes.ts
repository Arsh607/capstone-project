import express, { Router } from "express";
import * as supplierController from '../controllers/supplierController';

const router: Router = express.Router();

router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', supplierController.create);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.deleteSupplier );

export default router;