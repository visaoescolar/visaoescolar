const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

// Define que quando bater um POST em /login, chama o controller
router.post("/login", AuthController.login);
router.post("/registrar", AuthController.registrar);

module.exports = router;
