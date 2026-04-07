import express, { Router } from "express";
import * as supplierController from '../controllers/supplierController';
import { createSupplierValidation, updateSupplierValidation, supplierIdValidation } from "../validation/supplierValidation";
import { validateBody, validateParams } from "../middleware/validation";
const router: Router = express.Router();

router.get('/', supplierController.getAll);
router.get('/:id', validateParams(supplierIdValidation), supplierController.getById);
router.post('/', validateBody(createSupplierValidation), supplierController.create);
router.put('/:id', 
    validateParams(supplierIdValidation),
    validateBody(updateSupplierValidation),
    supplierController.update);
router.delete('/:id', validateParams(supplierIdValidation), supplierController.deleteSupplier );

export default router;