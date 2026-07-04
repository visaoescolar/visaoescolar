const { Router } = require('express');
const ChamadaController = require('../controllers/ChamadaController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();

router.get('/chamada/aulas-do-dia', verificarToken, ChamadaController.obterAulasDoDia);
router.get('/chamada', verificarToken, ChamadaController.obterChamada);
router.post('/chamada', verificarToken, verificarPapel('professor'), ChamadaController.registrarChamada);

module.exports = router;
