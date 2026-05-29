const DisciplinaService = require("../services/disciplinaService");

class DisciplinaController {
  static async listar(req, res) {
    try {
      const disciplinas = await DisciplinaService.obterTodos();
      res.json({ sucesso: true, dados: disciplinas });
    } catch (erro) {
      res
        .status(500)
        .json({
          sucesso: false,
          mensagem: "Erro ao listar disciplinas",
          erro: erro.message,
        });
    }
  }

  static async obterPorId(req, res) {
    try {
      const { id } = req.params;
      const disciplina = await DisciplinaService.obterPorId(id);
      if (!disciplina)
        return res
          .status(404)
          .json({ sucesso: false, mensagem: "Não encontrada" });
      res.json({ sucesso: true, dados: disciplina });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  // ADICIONE ESTAS FUNÇÕES ABAIXO PARA AS ROTAS FUNCIONAREM:

  static async criar(req, res) {
    try {
      const nova = await DisciplinaService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: nova });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  static async listarPorCurso(req, res) {
    try {
      const { cursoId } = req.params;
      // Se ainda não tiver essa função no Service, retorne vazio por enquanto
      res.json({ sucesso: true, dados: [] });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  static async atualizar(req, res) {
    try {
      res.json({
        sucesso: true,
        mensagem: "Funcionalidade em desenvolvimento",
      });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  static async deletar(req, res) {
    try {
      res.json({
        sucesso: true,
        mensagem: "Funcionalidade em desenvolvimento",
      });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }
}

module.exports = DisciplinaController;
