const express = require('express');
const DashboardController = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/estatisticas:
 *   get:
 *     summary: Obtém estatísticas gerais das avaliações
 *     description: Retorna total, mínima, máxima, média e mediana das notas
 *     responses:
 *       200:
 *         description: Estatísticas calculadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 dados:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 27
 *                     minima:
 *                       type: number
 *                       example: 4.5
 *                     maxima:
 *                       type: number
 *                       example: 10.0
 *                     media:
 *                       type: number
 *                       example: 7.87
 *                     mediana:
 *                       type: number
 *                       example: 8.0
 */
router.get('/estatisticas', DashboardController.obterEstatisticas);

/**
 * @swagger
 * /api/dashboard/estatisticas/por-aluno:
 *   get:
 *     summary: Obtém estatísticas das avaliações por aluno
 *     description: Retorna estatísticas de cada aluno
 *     responses:
 *       200:
 *         description: Estatísticas por aluno calculadas com sucesso
 */
router.get('/estatisticas/por-aluno', DashboardController.obterEstatisticasPorAluno);

/**
 * @swagger
 * /api/dashboard/estatisticas/por-disciplina:
 *   get:
 *     summary: Obtém estatísticas das avaliações por disciplina
 *     description: Retorna estatísticas de cada disciplina
 *     responses:
 *       200:
 *         description: Estatísticas por disciplina calculadas com sucesso
 */
router.get('/estatisticas/por-disciplina', DashboardController.obterEstatisticasPorDisciplina);

module.exports = router;
