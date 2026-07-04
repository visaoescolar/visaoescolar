const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const router = Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/registrar', AuthController.registrar);

module.exports = router;
