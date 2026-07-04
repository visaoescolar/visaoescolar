const Aluno = require('../database/models/Aluno');
const Pessoa = require('../database/models/Pessoa');
const Matricula = require('../database/models/Matricula');
const Grade = require('../database/models/Grade');
const GradeProfessor = require('../database/models/GradeProfessor');
const Aula = require('../database/models/Aula');
const Frequencia = require('../database/models/Frequencia');
const Professor = require('../database/models/Professor');
const Turma = require('../database/models/Turma');
const Disciplina = require('../database/models/Disciplina');
const Horario = require('../database/models/Horario');

async function resolverProfessor(usuarioId) {
  if (!usuarioId) return null;
  const pessoa = await Pessoa.findOne({ where: { id_usuario: usuarioId } });
  if (!pessoa) return null;
  return Professor.findOne({ where: { id_pessoa: pessoa.id } });
}

async function resolverGradeProfessor(usuarioId, gradeId) {
  const professor = await resolverProfessor(usuarioId);
  if (!professor) return null;
  return GradeProfessor.findOne({ where: { id_grade: gradeId, id_professor: professor.id } });
}

function calcularDiaSemana(data) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).getDay();
}

module.exports = {
  // Obter a chamada (lista de alunos + presença) de uma turma/disciplina/data
  async obterChamada(req, res) {
    try {
      const { turma_id, disciplina_id, data, usuario_id } = req.query;

      if (!turma_id || !disciplina_id || !data) {
        return res.status(400).json({ sucesso: false, mensagem: 'Turma, Disciplina e Data são obrigatórios.' });
      }

      // 1. Buscar a Grade correspondente
      const grade = await Grade.findOne({
        where: { id_turma: turma_id, id_disciplina: disciplina_id }
      });

      if (!grade) {
        return res.status(404).json({ sucesso: false, mensagem: 'Grade não encontrada para esta turma e disciplina.' });
      }

      // 2. Resolver o GradeProfessor do professor logado, ou qualquer um existente (modo leitura)
      let gp = await resolverGradeProfessor(usuario_id, grade.id);
      if (!gp) {
        gp = await GradeProfessor.findOne({ where: { id_grade: grade.id } });
      }

      // 3. Buscar a Aula de chamada já existente para essa data (sem criar no GET)
      let aula = null;
      if (gp) {
        aula = await Aula.findOne({
          where: { id_grade_professor: gp.id, data_aula: data, tipo: 'chamada' }
        });
      }

      // 4. Buscar matrículas da grade
      const matriculas = await Matricula.findAll({
        where: { id_grade: grade.id },
        include: [{
          model: Aluno,
          include: [{ model: Pessoa, as: 'pessoa' }]
        }]
      });

      // 5. Mapear alunos com sua presença (se já lançada)
      const alunosChamada = [];
      for (const mat of matriculas) {
        const aluno = mat.aluno || {};
        const pessoa = aluno.pessoa || {};

        if (!aluno.id) continue;

        let presente = null;
        let observacao = '';
        if (aula) {
          const freq = await Frequencia.findOne({ where: { id_matricula: mat.id, id_aula: aula.id } });
          if (freq) {
            presente = !!freq.presente;
            observacao = freq.observacao || '';
          }
        }

        alunosChamada.push({
          matricula_id: mat.id,
          aluno_id: aluno.id,
          matricula: aluno.matricula || '',
          nome: pessoa.nome || 'Desconhecido',
          presente,
          observacao
        });
      }

      return res.json({
        sucesso: true,
        dados: {
          aula_id: aula ? aula.id : null,
          conteudo: aula ? aula.conteudo : '',
          alunos: alunosChamada
        }
      });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter chamada.', detalhes: error.message });
    }
  },

  // Registrar/salvar a chamada de uma turma/disciplina/data
  async registrarChamada(req, res) {
    try {
      const { turma_id, disciplina_id, data, usuario_id, conteudo, presencas } = req.body;

      if (!turma_id || !disciplina_id || !data || !Array.isArray(presencas)) {
        return res.status(400).json({ sucesso: false, mensagem: 'Parâmetros inválidos.' });
      }

      // 1. Buscar a Grade correspondente
      const grade = await Grade.findOne({
        where: { id_turma: turma_id, id_disciplina: disciplina_id }
      });

      if (!grade) {
        return res.status(404).json({ sucesso: false, mensagem: 'Grade não encontrada para esta turma e disciplina.' });
      }

      // 2. Exigir que o professor logado esteja de fato vinculado a essa turma/disciplina
      const gp = await resolverGradeProfessor(usuario_id, grade.id);
      if (!gp) {
        return res.status(403).json({ sucesso: false, mensagem: 'Você não está vinculado a esta turma/disciplina.' });
      }

      // 3. Buscar ou criar a Aula de chamada para essa data
      const [aula] = await Aula.findOrCreate({
        where: { id_grade_professor: gp.id, data_aula: data, tipo: 'chamada' },
        defaults: { conteudo: conteudo || '' }
      });

      if (conteudo !== undefined && aula.conteudo !== conteudo) {
        await aula.update({ conteudo });
      }

      // 4. Salvar a presença de cada aluno
      for (const item of presencas) {
        const { matricula_id, presente, observacao } = item;
        if (!matricula_id) continue;

        const [freq] = await Frequencia.findOrCreate({
          where: { id_matricula: matricula_id, id_aula: aula.id },
          defaults: { presente: presente ? 1 : 0, observacao: observacao || '' }
        });
        await freq.update({ presente: presente ? 1 : 0, observacao: observacao || '' });
      }

      return res.json({ sucesso: true, mensagem: 'Chamada registrada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao registrar chamada.', detalhes: error.message });
    }
  },

  // Lista as aulas do dia (cards) a partir do horário cadastrado, cruzando com o dia da semana
  async obterAulasDoDia(req, res) {
    try {
      const { data, usuario_id } = req.query;

      if (!data) {
        return res.status(400).json({ sucesso: false, mensagem: 'Data é obrigatória.' });
      }

      const diaSemana = calcularDiaSemana(data);
      const professor = await resolverProfessor(usuario_id);

      const whereHorario = { dia_semana: diaSemana };
      if (professor) {
        const gpsDoProfessor = await GradeProfessor.findAll({ where: { id_professor: professor.id } });
        whereHorario.id_grade_professor = gpsDoProfessor.map(gp => gp.id);
      }

      const horarios = await Horario.findAll({
        where: whereHorario,
        order: [['hora_inicio', 'ASC']],
        include: [{
          model: GradeProfessor,
          include: [
            { model: Grade, include: [{ model: Turma }, { model: Disciplina }] },
            { model: Professor, include: [{ model: Pessoa, as: 'pessoa' }] }
          ]
        }]
      });

      const cards = [];
      for (const horario of horarios) {
        const gp = horario.grade_professor || {};
        const grade = gp.grade || {};
        const turma = grade.turma || {};
        const disciplina = grade.disciplina || {};
        const profPessoa = (gp.professor || {}).pessoa || {};

        if (!gp.id) continue;

        const aulaExistente = await Aula.findOne({
          where: { id_grade_professor: gp.id, data_aula: data, tipo: 'chamada' }
        });

        cards.push({
          horario_id: horario.id,
          grade_professor_id: gp.id,
          turma_id: turma.id,
          turma_descricao: turma.descricao || 'Sem turma',
          disciplina_id: disciplina.id,
          disciplina_descricao: disciplina.descricao || 'Sem disciplina',
          hora_inicio: horario.hora_inicio,
          professor_nome: professor ? null : (profPessoa.nome || 'Desconhecido'),
          chamada_feita: !!aulaExistente
        });
      }

      return res.json({ sucesso: true, dados: cards });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter aulas do dia.', detalhes: error.message });
    }
  },

  // Reaproveitados pelo NotificacaoController
  resolverProfessor,
  calcularDiaSemana
};
