import express, { Router } from "express";
import * as inventoryController from "../controllers/transactionController";
import {
  createTransactionValidation,
  updateTransactionValidation,
  transactionIdValidation,
} from "../validation/transactionValidation";
import { validateParams, validateBody } from "../middleware/validation";
import { authenticate } from "../middleware/authenticate";
import { isAuthorized } from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/transactions:
 *   get:
 *     summary: Get all inventory transactions
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/", 
  authenticate,
  isAuthorized({hasRole: ["admin", "manager", "employee"]}),
  inventoryController.getAll);

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({hasRole: ["admin", "manager", "employee"]}),
  validateParams(transactionIdValidation),
  inventoryController.getById
);

/**
 * @openapi
 * /api/v1/transactions:
 *   post:
 *     summary: Create a new inventory transaction
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post(
  "/",
  authenticate,
  isAuthorized({hasRole: ["admin", "manager", "employee"]}),
  validateBody(createTransactionValidation),
  inventoryController.create
);

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.put(
  "/:id",
  authenticate,
  isAuthorized({hasRole: ["admin", "manager"]}),
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
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.delete(
  "/:id",
  authenticate,
  isAuthorized({hasRole: ["admin", "manager"]}),
  validateParams(transactionIdValidation),
  inventoryController.deleteTransaction
);

export default router;