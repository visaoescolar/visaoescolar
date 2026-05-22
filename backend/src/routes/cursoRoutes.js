const express = require('express');
const CursoController = require('../controllers/cursoController');

const router = express.Router();

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     description: Retorna um array com todos os cursos cadastrados
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 dados:
 *                   type: array
 *   post:
 *     summary: Cria um novo curso
 *     description: Cria um novo curso com os dados fornecidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               codigo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 */
router.get('/', CursoController.listar);
router.post('/', CursoController.criar);

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtém um curso específico
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Curso encontrado
 *       404:
 *         description: Curso não encontrado
 *   put:
 *     summary: Atualiza um curso
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               codigo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *   delete:
 *     summary: Deleta um curso
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Curso deletado com sucesso
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', CursoController.obterPorId);
router.put('/:id', CursoController.atualizar);
router.delete('/:id', CursoController.deletar);

module.exports = router;
