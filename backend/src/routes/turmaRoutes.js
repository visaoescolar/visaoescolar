const { Router } = require('express');
const TurmaController = require('../controllers/TurmaController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();
const exigirCoordenador = [verificarToken, verificarPapel('coordenador')];

// Leitura aberta a qualquer usuário autenticado (ex: filtro de turma em Alunos.vue para professor)
router.get('/turmas', verificarToken, TurmaController.listar);
router.post('/turmas', exigirCoordenador, TurmaController.criar);
router.delete('/turmas/:id', exigirCoordenador, TurmaController.deletar);

module.exports = router;
