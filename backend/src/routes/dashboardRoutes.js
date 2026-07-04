const { Router } = require('express');
const DashboardController = require('../controllers/DashboardController');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.get('/dashboard-stats', verificarToken, DashboardController.obterEstatisticas);

module.exports = router;
