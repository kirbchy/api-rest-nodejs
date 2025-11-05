import { Router } from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { list, getById, searchByUsername, getByCedula, create, update, remove, getPhotoRedirect, getPartidosByArbitro, dashboard } from '../controllers/arbitroController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Arbitros
 *   description: Endpoints para árbitros (proxy de Spring + fotos en S3)
 */

/**
 * @swagger
 * /api/arbitros:
 *   get:
 *     summary: Listar árbitros
 *     tags: [Arbitros]
 *     responses:
 *       200:
 *         description: Lista de árbitros
 */
router.get('/', authRequired, list);

/**
 * @swagger
 * /api/arbitros/{id}:
 *   get:
 *     summary: Obtener árbitro por ID
 *     tags: [Arbitros]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arbitro
 */
// Importante: rutas específicas antes de "/:id" para evitar colisiones

/**
 * @swagger
 * /api/arbitros/search:
 *   get:
 *     summary: Buscar árbitro por username
 *     tags: [Arbitros]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 */
router.get('/search', authRequired, searchByUsername);

router.get('/cedula/:cedula', authRequired, getByCedula);

router.get('/:id/photo', getPhotoRedirect);

/**
 * @swagger
 * /api/arbitros/{id}/partidos:
 *   get:
 *     summary: Partidos asignados a un árbitro
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id/partidos', authRequired, getPartidosByArbitro);

/**
 * @swagger
 * /api/arbitros/{id}/dashboard:
 *   get:
 *     summary: Datos de dashboard para un árbitro
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id/dashboard', authRequired, dashboard);

router.get('/:id', authRequired, getById);

router.post('/',
  authRequired,
  upload.single('photo'),
  body('nombre').notEmpty(),
  body('cedula').notEmpty(),
  body('username').notEmpty(),
  body('contraseña').notEmpty(),
  body('phone').notEmpty(),
  body('speciality').notEmpty(),
  create
);

/**
 * @swagger
 * /api/arbitros:
 *   post:
 *     summary: Crear árbitro (opcionalmente subir foto)
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cedula:
 *                 type: string
 *               username:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               phone:
 *                 type: string
 *               speciality:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 */

/**
 * @swagger
 * /api/arbitros/{id}:
 *   put:
 *     summary: Actualizar árbitro y/o subir foto
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cedula:
 *                 type: string
 *               username:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               phone:
 *                 type: string
 *               speciality:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 */
router.put('/:id', authRequired, upload.single('photo'), update);
router.delete('/:id', authRequired, remove);

export default router;
