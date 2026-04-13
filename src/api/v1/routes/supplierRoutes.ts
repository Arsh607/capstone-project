import express, { Router } from "express";
import * as supplierController from '../controllers/supplierController';
import { createSupplierValidation, updateSupplierValidation, supplierIdValidation } from "../validation/supplierValidation";
import { validateBody, validateParams } from "../middleware/validation";
import { authenticate } from "../middleware/authenticate";
import { auth } from "firebase-admin";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags:
 *       - Suppliers
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 */
router.get('/', authenticate, supplierController.getAll);

/**
 * @openapi
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: supp_1
 *     responses:
 *       200:
 *         description: Supplier retrieved successfully
 *       404:
 *         description: Supplier not found
 */
router.get('/:id', authenticate, validateParams(supplierIdValidation), supplierController.getById);

/**
 * @openapi
 * /api/v1/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags:
 *       - Suppliers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple Distribution Canada
 *               email:
 *                 type: string
 *                 example: sales@apple.ca
 *               phoneNumber:
 *                 type: string
 *                 example: 2041234567
 *               address:
 *                 type: string
 *                 example: Winnipeg, MB
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, validateBody(createSupplierValidation), supplierController.create);

/**
 * @openapi
 * /api/v1/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: supp_1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 */
router.put(
  '/:id',
  authenticate,
  validateParams(supplierIdValidation),
  validateBody(updateSupplierValidation),
  supplierController.update
);

/**
 * @openapi
 * /api/v1/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: supp_1
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */
router.delete('/:id', authenticate, validateParams(supplierIdValidation), supplierController.deleteSupplier);

export default router;