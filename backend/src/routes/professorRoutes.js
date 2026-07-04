const { Router } = require('express');
const ProfessorController = require('../controllers/ProfessorController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();
const exigirCoordenador = [verificarToken, verificarPapel('coordenador')];

router.post('/professores', exigirCoordenador, ProfessorController.criar);
router.get('/professores', exigirCoordenador, ProfessorController.listar);
router.put('/professores/:id', exigirCoordenador, ProfessorController.atualizar);
router.delete('/professores/:id', exigirCoordenador, ProfessorController.deletar);
router.get('/professores/:usuarioId/turmas', verificarToken, ProfessorController.obterTurmas);

module.exports = router;
