import express, { Router } from "express";
import * as inventoryController from '../controllers/transactionController';
import { createTransactionValidation, updateTransactionValidation, transactionIdValidation } from "../validation/transactionValidation";
import { validateParams, validateBody } from "../middleware/validation";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/transactions:
 *   get:
 *     summary: Get all inventory transactions
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.get('/', inventoryController.getAll);

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: trans_1
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', validateParams(transactionIdValidation), inventoryController.getById);

/**
 * @openapi
 * /api/v1/transactions:
 *   post:
 *     summary: Create a new inventory transaction
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantityChanged
 *               - type
 *             properties:
 *               productId:
 *                 type: string
 *                 example: prod_1
 *               quantityChanged:
 *                 type: number
 *                 example: 5
 *               type:
 *                 type: string
 *                 enum: [add, remove, adjust]
 *                 example: add
 *               notes:
 *                 type: string
 *                 example: Restocked from supplier
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Product not found
 */
router.post('/', validateBody(createTransactionValidation), inventoryController.create);

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: trans_1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Updated notes
 *               type:
 *                 type: string
 *                 enum: [add, remove, adjust]
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.put(
  '/:id',
  validateParams(transactionIdValidation),
  validateBody(updateTransactionValidation),
  inventoryController.update
);

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: trans_1
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', validateParams(transactionIdValidation), inventoryController.deleteTransaction);

export default router;