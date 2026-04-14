import * as authController from "../controllers/authController";
import express, { Router } from "express";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signIn:
 *   post:
 *     summary: Sign in a user using email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Sign in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign in successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     idToken:
 *                       type: string
 *                       example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     localId:
 *                       type: string
 *                       example: abc123XYZ
 *                     expiresIn:
 *                       type: string
 *                       example: "3600"
 *                     refreshToken:
 *                       type: string
 *                       example: someRefreshTokenValue
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid email or password
 */
router.post("/signIn", authController.signIn);

export default router;