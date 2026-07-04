const GradeProfessor = require('../database/models/GradeProfessor');
const Grade = require('../database/models/Grade');
const Turma = require('../database/models/Turma');
const Disciplina = require('../database/models/Disciplina');
const Horario = require('../database/models/Horario');
const Aula = require('../database/models/Aula');
const Frequencia = require('../database/models/Frequencia');
const { resolverProfessor, calcularDiaSemana } = require('./ChamadaController');

const LIMITE_FREQUENCIA = 75;

function hojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

async function notificacoesProfessor(professor) {
  const notificacoes = [];
  const data = hojeISO();
  const diaSemana = calcularDiaSemana(data);

  const gradeProfessores = await GradeProfessor.findAll({
    where: { id_professor: professor.id },
    include: [{ model: Grade, include: [{ model: Turma }, { model: Disciplina }] }]
  });
  const gpIds = gradeProfessores.map(gp => gp.id);

  // 1. Chamadas pendentes hoje
  if (gpIds.length > 0) {
    const horariosHoje = await Horario.findAll({ where: { dia_semana: diaSemana, id_grade_professor: gpIds } });
    let pendentes = 0;
    for (const horario of horariosHoje) {
      const aula = await Aula.findOne({ where: { id_grade_professor: horario.id_grade_professor, data_aula: data, tipo: 'chamada' } });
      if (!aula) pendentes++;
    }
    if (pendentes > 0) {
      notificacoes.push({
        id: 'chamada-pendente',
        severidade: 'aviso',
        icone: 'fa-solid fa-clipboard-check',
        mensagem: `Você tem ${pendentes} chamada${pendentes > 1 ? 's' : ''} pendente${pendentes > 1 ? 's' : ''} hoje.`,
        link: '/chamada'
      });
    }
  }

  // 2. Turmas/disciplinas com frequência geral abaixo do mínimo (a partir das chamadas já lançadas)
  for (const gp of gradeProfessores) {
    const aulasChamada = await Aula.findAll({ where: { id_grade_professor: gp.id, tipo: 'chamada' } });
    if (aulasChamada.length === 0) continue;

    const aulaIds = aulasChamada.map(a => a.id);
    const frequencias = await Frequencia.findAll({ where: { id_aula: aulaIds } });
    if (frequencias.length === 0) continue;

    const presentes = frequencias.filter(f => f.presente).length;
    const percentual = Math.round((presentes / frequencias.length) * 100);

    if (percentual < LIMITE_FREQUENCIA) {
      const grade = gp.grade || {};
      const turma = grade.turma || {};
      const disciplina = grade.disciplina || {};
      notificacoes.push({
        id: `frequencia-baixa-${gp.id}`,
        severidade: 'alerta',
        icone: 'fa-solid fa-triangle-exclamation',
        mensagem: `${turma.descricao || 'Turma'} — ${disciplina.descricao || 'Disciplina'} está com frequência geral de ${percentual}% (abaixo de ${LIMITE_FREQUENCIA}%).`,
        link: '/chamada'
      });
    }
  }

  return notificacoes;
}

async function notificacoesCoordenador() {
  const notificacoes = [];
  const data = hojeISO();
  const diaSemana = calcularDiaSemana(data);

  // 1. Vínculos professor/turma/disciplina sem horário cadastrado
  const gradeProfessores = await GradeProfessor.findAll();
  const semHorario = [];
  for (const gp of gradeProfessores) {
    const horario = await Horario.findOne({ where: { id_grade_professor: gp.id } });
    if (!horario) semHorario.push(gp);
  }
  if (semHorario.length > 0) {
    notificacoes.push({
      id: 'horario-faltando',
      severidade: 'aviso',
      icone: 'fa-solid fa-clock',
      mensagem: `${semHorario.length} vínculo${semHorario.length > 1 ? 's' : ''} de turma/disciplina sem horário cadastrado.`,
      link: '/gestao-academica'
    });
  }

  // 2. Chamadas pendentes hoje em toda a escola
  const horariosHoje = await Horario.findAll({ where: { dia_semana: diaSemana } });
  let pendentes = 0;
  for (const horario of horariosHoje) {
    const aula = await Aula.findOne({ where: { id_grade_professor: horario.id_grade_professor, data_aula: data, tipo: 'chamada' } });
    if (!aula) pendentes++;
  }
  if (pendentes > 0) {
    notificacoes.push({
      id: 'chamada-pendente-escola',
      severidade: 'aviso',
      icone: 'fa-solid fa-clipboard-check',
      mensagem: `${pendentes} aula${pendentes > 1 ? 's' : ''} ainda sem chamada registrada hoje.`,
      link: '/chamada'
    });
  }

  return notificacoes;
}

module.exports = {
  // Lista os alertas calculados na hora para o usuário logado
  async listar(req, res) {
    try {
      const usuario = req.usuario || {};
      let notificacoes = [];

      if (usuario.tipo === 'coordenador') {
        notificacoes = await notificacoesCoordenador();
      } else {
        const professor = await resolverProfessor(usuario.id);
        if (professor) {
          notificacoes = await notificacoesProfessor(professor);
        }
      }

      return res.json({ sucesso: true, dados: notificacoes });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter notificações.', detalhes: error.message });
    }
  }
};
