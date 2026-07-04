const Curso = require('../database/models/Curso');

module.exports = {
  async criar(req, res) {
    try {
      const { descricao, sigla } = req.body;
      const curso = await Curso.create({ descricao, sigla });
      return res.status(201).json({ sucesso: true, dados: curso });
    } catch (error) {
      return res.status(400).json({ sucesso: false, erro: 'Erro ao criar curso', detalhes: error.message });
    }
  },

  async listar(req, res) {
    try {
      const cursos = await Curso.findAll();
      
      // Mapeia descricao para nome para preencher o dropdown do Vue
      const formatados = cursos.map(c => ({
        id: c.id,
        descricao: c.descricao,
        nome: c.descricao,
        sigla: c.sigla
      }));

      return res.json({ sucesso: true, dados: formatados });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao listar cursos', detalhes: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await Curso.destroy({ where: { id } });
      if (deletado) {
        return res.json({ sucesso: true, mensagem: 'Curso deletado com sucesso' });
      }
      return res.status(404).json({ sucesso: false, erro: 'Curso não encontrado' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao deletar curso', detalhes: error.message });
    }
  }
};