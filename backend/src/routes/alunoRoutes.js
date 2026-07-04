const { Router } = require('express');
const AlunoController = require('../controllers/AlunoController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();
const exigirCoordenador = [verificarToken, verificarPapel('coordenador')];

router.get('/alunos', verificarToken, AlunoController.listar);
router.get('/alunos/:id', verificarToken, AlunoController.buscarPorId);
router.post('/alunos', exigirCoordenador, AlunoController.criar);
router.put('/alunos/:id', exigirCoordenador, AlunoController.atualizar);
router.delete('/alunos/:id', exigirCoordenador, AlunoController.deletar);

module.exports = router;
