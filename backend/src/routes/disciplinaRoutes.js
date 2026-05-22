const express = require('express');
const DisciplinaController = require('../controllers/disciplinaController');

const router = express.Router();

/**
 * @swagger
 * /api/disciplinas:
 *   get:
 *     summary: Lista todas as disciplinas
 *     description: Retorna um array com todas as disciplinas cadastradas
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
 *     summary: Cria uma nova disciplina
 *     description: Cria uma nova disciplina com os dados fornecidos
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
 *               carga_horaria:
 *                 type: integer
 *               curso_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 */
router.get('/', DisciplinaController.listar);
router.post('/', DisciplinaController.criar);

/**
 * @swagger
 * /api/disciplinas/curso/{cursoId}:
 *   get:
 *     summary: Lista disciplinas por curso
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplinas do curso
 */
router.get('/curso/:cursoId', DisciplinaController.listarPorCurso);

/**
 * @swagger
 * /api/disciplinas/{id}:
 *   get:
 *     summary: Obtém uma disciplina específica
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplina encontrada
 *       404:
 *         description: Disciplina não encontrada
 *   put:
 *     summary: Atualiza uma disciplina
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
 *               carga_horaria:
 *                 type: integer
 *               curso_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso
 *   delete:
 *     summary: Deleta uma disciplina
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplina deletada com sucesso
 *       404:
 *         description: Disciplina não encontrada
 */
router.get('/:id', DisciplinaController.obterPorId);
router.put('/:id', DisciplinaController.atualizar);
router.delete('/:id', DisciplinaController.deletar);

module.exports = router;
