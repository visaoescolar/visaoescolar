const Disciplina = require('../database/models/Disciplina');
const Curso = require('../database/models/Curso');

module.exports = {
  // Listar todas as disciplinas
  async listar(req, res) {
    try {
      const disciplinas = await Disciplina.findAll({
        include: [{ model: Curso, as: 'curso' }]
      });

      const formatadas = disciplinas.map(d => ({
        id: d.id,
        codigo: d.codigo || `DISC-${d.id}`,
        nome: d.descricao,
        carga_horaria: d.carga_horaria || 60,
        curso_id: d.curso_id,
        nome_curso: d.curso ? d.curso.descricao : 'N/A',
        curso_nome: d.curso ? d.curso.descricao : 'N/A',
        ementa: d.ementa || ''
      }));

      return res.json({ sucesso: true, dados: formatadas });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar disciplinas.', detalhes: error.message });
    }
  },

  // Criar nova disciplina
  async criar(req, res) {
    try {
      const { nome, codigo, carga_horaria, curso_id, ementa } = req.body;

      if (!nome || !codigo || !curso_id) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome, código e curso são obrigatórios.' });
      }

      const disciplina = await Disciplina.create({
        descricao: nome,
        codigo,
        carga_horaria: carga_horaria ? parseInt(carga_horaria) : 60,
        curso_id: parseInt(curso_id),
        ementa: ementa || ''
      });

      return res.status(201).json({ sucesso: true, dados: disciplina });
    } catch (error) {
      return res.status(400).json({ sucesso: false, mensagem: 'Erro ao criar disciplina.', detalhes: error.message });
    }
  },

  // Deletar disciplina por ID
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const disciplina = await Disciplina.findByPk(id);
      if (!disciplina) {
        return res.status(404).json({ sucesso: false, mensagem: 'Disciplina não encontrada.' });
      }

      await disciplina.destroy();
      return res.json({ sucesso: true, mensagem: 'Disciplina removida com sucesso.' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar disciplina.', detalhes: error.message });
    }
  }
};
