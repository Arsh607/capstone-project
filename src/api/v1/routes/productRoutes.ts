import express, { Router } from "express";
import * as productController from "../controllers/productController";
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  productFilterValidation
} from "../validation/productValidation";
import { validateBody, validateParams, validateQuery } from "../middleware/validation";
import { authenticate } from "../middleware/authenticate";
import { isAuthorized } from "../middleware/authorize";


const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     description: Accessible by admin, manager, and employee roles. Supports filtering using query parameters.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Electronics, Office Supplies, Furniture, Food, Home Supplies]
 *         example: Electronics
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: string
 *         example: supp_1
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 500
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 2000
 *       - in: query
 *         name: minQuantity
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: maxQuantity
 *         schema:
 *           type: number
 *         example: 50
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (insufficient role)
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager", "employee"] }),
  validateQuery(productFilterValidation),
  productController.getAll
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Accessible by admin, manager, and employee roles.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient role)
 *       404:
 *         description: Product not found
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager", "employee"] }),
  validateParams(productIdValidation),
  productController.getById
);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     description: Accessible by admin and manager roles only.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient role)
 */
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager"] }),
  validateBody(createProductValidation),
  productController.create
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Accessible by admin and manager roles only.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient role)
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager"] }),
  validateParams(productIdValidation),
  validateBody(updateProductValidation),
  productController.update
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Accessible by admin and manager roles only.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient role)
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager"] }),
  validateParams(productIdValidation),
  productController.deleteProduct
);

export default router;