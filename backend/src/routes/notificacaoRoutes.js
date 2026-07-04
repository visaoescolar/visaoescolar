const { Router } = require('express');
const NotificacaoController = require('../controllers/NotificacaoController');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.get('/notificacoes', verificarToken, NotificacaoController.listar);

module.exports = router;
