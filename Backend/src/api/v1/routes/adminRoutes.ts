import * as adminController from "../controllers/adminController";
import express, { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { isAuthorized } from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/admin/setCustomClaims:
 *   post:
 *     summary: Assign a role to a user (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - role
 *             properties:
 *               uid:
 *                 type: string
 *                 example: abc123XYZ
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role set successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: abc123XYZ
 *                     role:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Bad request (missing uid or role / invalid role)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (only admin can assign roles)
 */
router.post(
  "/setCustomClaims",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  adminController.setCustomClaims
);

export default router;