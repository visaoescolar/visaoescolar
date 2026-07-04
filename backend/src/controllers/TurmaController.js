const Turma = require('../database/models/Turma');

module.exports = {
  async criar(req, res) {
    try {
      const { descricao } = req.body;
      if (!descricao) {
        return res.status(400).json({ sucesso: false, erro: 'Descrição é obrigatória.' });
      }
      const turma = await Turma.create({ descricao });
      return res.status(201).json({ sucesso: true, dados: turma });
    } catch (error) {
      return res.status(400).json({ sucesso: false, erro: 'Erro ao criar turma', detalhes: error.message });
    }
  },

  async listar(req, res) {
    try {
      const turmas = await Turma.findAll();
      return res.json({ sucesso: true, dados: turmas });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao listar turmas', detalhes: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await Turma.destroy({ where: { id } });
      if (deletado) {
        return res.json({ sucesso: true, mensagem: 'Turma deletada com sucesso' });
      }
      return res.status(404).json({ sucesso: false, erro: 'Turma não encontrada' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao deletar turma', detalhes: error.message });
    }
  }
};
