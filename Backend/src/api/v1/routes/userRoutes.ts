import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";
import { authenticate } from "../middleware/authenticate";
import { isAuthorized } from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user details by ID (Admin only)
 *     description: Retrieves Firebase user details using the user's UID. Accessible only by admin users.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: Lt9yCJSVoogSanugPrS1Inv3n3K2
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   description: Firebase user record
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (only admin can access this endpoint)
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  getUserDetails
);

export default router;