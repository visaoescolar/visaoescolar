const { Router } = require('express');
const NotasFrequenciaController = require('../controllers/NotasFrequenciaController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();

router.get('/notas-frequencia', verificarToken, NotasFrequenciaController.obterPlanilha);
router.post('/notas-frequencia', verificarToken, verificarPapel('professor'), NotasFrequenciaController.publicarPlanilha);
router.get('/professores/boletim-consolidado', verificarToken, NotasFrequenciaController.obterBoletimConsolidado);

module.exports = router;
