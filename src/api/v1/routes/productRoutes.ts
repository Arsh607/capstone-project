import express, { Router } from "express";
import * as productController from '../controllers/productController';
import { createProductValidation, updateProductValidation, productIdValidation } from "../validation/productValidation";
import { validateBody, validateParams } from "../middleware/validation";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/', productController.getAll);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: prod_1
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', validateParams(productIdValidation), productController.getById);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - quantity
 *               - category
 *               - supplierId
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16 Pro Max 128GB Black
 *               description:
 *                 type: string
 *                 example: Premium smartphone with advanced features
 *               price:
 *                 type: number
 *                 example: 1700
 *               quantity:
 *                 type: number
 *                 example: 5
 *               category:
 *                 type: string
 *                 example: Electronics
 *               supplierId:
 *                 type: string
 *                 example: supp_1
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateBody(createProductValidation), productController.create);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: prod_1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *               supplierId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  validateParams(productIdValidation),
  validateBody(updateProductValidation),
  productController.update
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: prod_1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', validateParams(productIdValidation), productController.deleteProduct);

export default router;