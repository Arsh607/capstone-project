import express, { Router } from "express";
import * as inventoryController from '../controllers/transactionController';
import { createTransactionValidation, updateTransactionValidation, transactionIdValidation } from "../validation/transactionValidation";
import { validateParams, validateBody } from "../middleware/validation";

const router: Router = express.Router();

router.get('/', inventoryController.getAll);
router.get('/:id', validateParams(transactionIdValidation), inventoryController.getById);
router.post('/', validateBody(createTransactionValidation),inventoryController.create);
router.put('/:id',
    validateParams(transactionIdValidation), 
    validateBody(updateTransactionValidation), 
    inventoryController.update);
router.delete('/:id', validateParams(transactionIdValidation), inventoryController.deleteTransaction);

export default router;