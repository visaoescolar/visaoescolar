const { Router } = require('express');
const HorarioController = require('../controllers/HorarioController');
const { verificarToken, verificarPapel } = require('../middlewares/auth');

const router = Router();

router.get('/horarios/vinculos', verificarToken, verificarPapel('coordenador'), HorarioController.listarVinculos);
router.get('/horarios', verificarToken, verificarPapel('coordenador'), HorarioController.listar);
router.post('/horarios', verificarToken, verificarPapel('coordenador'), HorarioController.criar);
router.delete('/horarios/:id', verificarToken, verificarPapel('coordenador'), HorarioController.deletar);

module.exports = router;
