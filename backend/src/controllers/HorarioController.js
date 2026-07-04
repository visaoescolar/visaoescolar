const Horario = require('../database/models/Horario');
const GradeProfessor = require('../database/models/GradeProfessor');
const Grade = require('../database/models/Grade');
const Turma = require('../database/models/Turma');
const Disciplina = require('../database/models/Disciplina');
const Professor = require('../database/models/Professor');
const Pessoa = require('../database/models/Pessoa');

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

async function montarVinculos() {
  const gradeProfessores = await GradeProfessor.findAll({
    include: [
      { model: Grade, include: [{ model: Turma }, { model: Disciplina }] },
      { model: Professor, include: [{ model: Pessoa, as: 'pessoa' }] }
    ]
  });

  return gradeProfessores.map(gp => {
    const grade = gp.grade || {};
    const turma = grade.turma || {};
    const disciplina = grade.disciplina || {};
    const professor = gp.professor || {};
    const pessoa = professor.pessoa || {};

    return {
      grade_professor_id: gp.id,
      professor_nome: pessoa.nome || 'Desconhecido',
      turma_id: turma.id,
      turma_descricao: turma.descricao || 'Sem turma',
      disciplina_id: disciplina.id,
      disciplina_descricao: disciplina.descricao || 'Sem disciplina',
      label: `${pessoa.nome || 'Desconhecido'} — ${turma.descricao || 'Sem turma'} — ${disciplina.descricao || 'Sem disciplina'}`
    };
  });
}

module.exports = {
  // Lista os vínculos professor+turma+disciplina disponíveis, para o formulário de horário
  async listarVinculos(req, res) {
    try {
      const vinculos = await montarVinculos();
      return res.json({ sucesso: true, dados: vinculos });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar vínculos.', detalhes: error.message });
    }
  },

  // Lista todos os horários cadastrados
  async listar(req, res) {
    try {
      const vinculos = await montarVinculos();
      const vinculosPorId = new Map(vinculos.map(v => [v.grade_professor_id, v]));

      const horarios = await Horario.findAll({ order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']] });

      const dados = horarios.map(h => {
        const vinculo = vinculosPorId.get(h.id_grade_professor) || {};
        return {
          id: h.id,
          dia_semana: h.dia_semana,
          dia_semana_nome: DIAS_SEMANA[h.dia_semana] || '—',
          hora_inicio: h.hora_inicio,
          grade_professor_id: h.id_grade_professor,
          professor_nome: vinculo.professor_nome || 'Desconhecido',
          turma_descricao: vinculo.turma_descricao || 'Sem turma',
          disciplina_descricao: vinculo.disciplina_descricao || 'Sem disciplina'
        };
      });

      return res.json({ sucesso: true, dados });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar horários.', detalhes: error.message });
    }
  },

  // Cria um novo horário
  async criar(req, res) {
    try {
      const { grade_professor_id, dia_semana, hora_inicio } = req.body;

      if (!grade_professor_id || dia_semana === undefined || dia_semana === null || !hora_inicio) {
        return res.status(400).json({ sucesso: false, mensagem: 'Vínculo, dia da semana e horário são obrigatórios.' });
      }

      const gp = await GradeProfessor.findByPk(grade_professor_id);
      if (!gp) {
        return res.status(404).json({ sucesso: false, mensagem: 'Vínculo professor/turma/disciplina não encontrado.' });
      }

      const horario = await Horario.create({
        id_grade_professor: grade_professor_id,
        dia_semana: parseInt(dia_semana),
        hora_inicio
      });

      return res.status(201).json({ sucesso: true, mensagem: 'Horário cadastrado com sucesso!', dados: horario });
    } catch (error) {
      return res.status(400).json({ sucesso: false, mensagem: 'Erro ao cadastrar horário.', detalhes: error.message });
    }
  },

  // Remove um horário
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const horario = await Horario.findByPk(id);
      if (!horario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Horário não encontrado.' });
      }
      await horario.destroy();
      return res.json({ sucesso: true, mensagem: 'Horário removido com sucesso!' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover horário.', detalhes: error.message });
    }
  },

  DIAS_SEMANA
};
