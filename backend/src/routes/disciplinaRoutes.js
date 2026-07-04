const { Router } = require('express');
const DisciplinaController = require('../controllers/DisciplinaController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();
const exigirCoordenador = [verificarToken, verificarPapel('coordenador')];

router.get('/disciplinas', exigirCoordenador, DisciplinaController.listar);
router.post('/disciplinas', exigirCoordenador, DisciplinaController.criar);
router.delete('/disciplinas/:id', exigirCoordenador, DisciplinaController.deletar);

module.exports = router;
