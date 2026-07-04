const { Router } = require('express');
const CursoController = require('../controllers/CursoController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();
const exigirCoordenador = [verificarToken, verificarPapel('coordenador')];

router.post('/cursos', exigirCoordenador, CursoController.criar);
router.get('/cursos', exigirCoordenador, CursoController.listar);
router.delete('/cursos/:id', exigirCoordenador, CursoController.deletar);

module.exports = router;
