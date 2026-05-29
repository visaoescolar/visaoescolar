const AuthService = require("../services/authService");

class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await AuthService.login(email, senha);
      res.json({ sucesso: true, dados: resultado });
    } catch (erro) {
      res.status(401).json({ sucesso: false, mensagem: erro.message });
    }
  }

  static async registrar(req, res) {
    try {
      // O ERRO ESTAVA AQUI: Antes estava AuthService.registrarAluno
      // Agora deve ser AuthService.registrar
      const usuario = await AuthService.registrar(req.body);

      res.status(201).json({
        sucesso: true,
        mensagem: "Cadastro realizado com sucesso!",
        dados: usuario,
      });
    } catch (erro) {
      res.status(400).json({ sucesso: false, mensagem: erro.message });
    }
  }
}

module.exports = AuthController;
