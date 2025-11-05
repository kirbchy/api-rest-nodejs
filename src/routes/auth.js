import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de árbitros (JWT manejado por Node)
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', body('username').notEmpty(), body('password').notEmpty(), login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un árbitro en Spring y devolver JWT
 *     tags: [Auth]
 */
router.post('/register',
  body('nombre').notEmpty(),
  body('cedula').notEmpty(),
  body('username').notEmpty(),
  body('contraseña').notEmpty(),
  body('phone').notEmpty(),
  body('speciality').notEmpty(),
  register
);

export default router;
