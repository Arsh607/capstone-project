import express, { Router } from "express";
import * as inventoryController from '../controllers/transactionController';

const router: Router = express.Router();

router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);
router.post('/', inventoryController.create);
router.put('/:id', inventoryController.update);
router.delete('/:id', inventoryController.deleteTransaction);

export default router;