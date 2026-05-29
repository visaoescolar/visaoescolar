const AlunoService = require("../services/alunoService");

class AlunoController {
  static async listar(req, res) {
    try {
      const alunos = await AlunoService.obterTodos();
      res.json({ sucesso: true, dados: alunos });
    } catch (erro) {
      res.status(500).json({ sucesso: false, mensagem: erro.message });
    }
  }
}
module.exports = AlunoController;
