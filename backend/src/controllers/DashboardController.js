const Aluno = require('../database/models/Aluno');
const Pessoa = require('../database/models/Pessoa');
const Professor = require('../database/models/Professor');
const Matricula = require('../database/models/Matricula');
const Avaliacao = require('../database/models/Avaliacao');
const Aula = require('../database/models/Aula');
const GradeProfessor = require('../database/models/GradeProfessor');
const Grade = require('../database/models/Grade');
const Disciplina = require('../database/models/Disciplina');
const Frequencia = require('../database/models/Frequencia');

module.exports = {
  async obterEstatisticas(req, res) {
    try {
      const usuario = req.usuario || {};

      // Se quem está pedindo é professor, restringe tudo às turmas em que ele leciona.
      // Coordenador continua vendo os dados de toda a instituição.
      let gradeIds = null;
      let aulaIds = null;

      if (usuario.tipo === 'professor') {
        const pessoa = await Pessoa.findOne({ where: { id_usuario: usuario.id } });
        const professor = pessoa ? await Professor.findOne({ where: { id_pessoa: pessoa.id } }) : null;

        const gradeProfessores = professor
          ? await GradeProfessor.findAll({ where: { id_professor: professor.id } })
          : [];

        gradeIds = gradeProfessores.map(gp => gp.id_grade);
        const gradeProfessorIds = gradeProfessores.map(gp => gp.id);

        const aulas = gradeProfessorIds.length > 0
          ? await Aula.findAll({ where: { id_grade_professor: gradeProfessorIds } })
          : [];
        aulaIds = aulas.map(a => a.id);
      }

      const whereAula = aulaIds !== null ? { id_aula: aulaIds } : {};

      // 1. Total de alunos (matriculados nas turmas do professor, ou todos os alunos para o coordenador)
      let totalAlunos;
      if (gradeIds !== null) {
        const matriculas = await Matricula.findAll({ where: { id_grade: gradeIds }, attributes: ['id_aluno'] });
        totalAlunos = new Set(matriculas.map(m => m.id_aluno)).size;
      } else {
        totalAlunos = await Aluno.count();
      }

      // 2. Média geral das avaliações no escopo
      const avaliacoes = await Avaliacao.findAll({ where: whereAula });
      let mediaGeral = 0;
      if (avaliacoes.length > 0) {
        const soma = avaliacoes.reduce((acc, av) => acc + Number(av.nota || 0), 0);
        mediaGeral = Number((soma / avaliacoes.length).toFixed(1));
      }

      // 3. Alunos em Risco (Média de avaliações < 6.0)
      // Agrupar notas por aluno (matricula)
      const notasPorMatricula = {};
      avaliacoes.forEach(av => {
        if (!notasPorMatricula[av.id_matricula]) {
          notasPorMatricula[av.id_matricula] = [];
        }
        notasPorMatricula[av.id_matricula].push(Number(av.nota || 0));
      });

      let alunosRisco = 0;
      let matriculasAprovadas = 0;
      const totalMatriculasComNota = Object.keys(notasPorMatricula).length;
      Object.values(notasPorMatricula).forEach(notas => {
        const avg = notas.reduce((acc, n) => acc + n, 0) / notas.length;
        if (avg < 6.0) {
          alunosRisco++;
        } else {
          matriculasAprovadas++;
        }
      });

      // Taxa de Aprovação (% de matrículas com média de notas >= 6.0)
      let taxaAprovacao = 0;
      if (totalMatriculasComNota > 0) {
        taxaAprovacao = Number(((matriculasAprovadas / totalMatriculasComNota) * 100).toFixed(1));
      }

      // 4. Desempenho por Disciplina (Gráfico de Barras)
      // Fazemos junções para encontrar a disciplina correspondente a cada avaliação
      const avaliacoesComGrade = await Avaliacao.findAll({
        where: whereAula,
        include: [{
          model: Aula,
          include: [{
            model: GradeProfessor,
            include: [{
              model: Grade,
              include: [{
                model: Disciplina
              }]
            }]
          }]
        }]
      });

      const notasPorDisciplina = {};
      avaliacoesComGrade.forEach(av => {
        const disciplina = av.aula?.grade_professor?.grade?.disciplina;
        if (disciplina) {
          const nomeDisc = disciplina.descricao;
          if (!notasPorDisciplina[nomeDisc]) {
            notasPorDisciplina[nomeDisc] = [];
          }
          notasPorDisciplina[nomeDisc].push(Number(av.nota || 0));
        }
      });

      const labelsDesempenho = [];
      const dataDesempenho = [];
      Object.entries(notasPorDisciplina).forEach(([nomeDisc, notas]) => {
        labelsDesempenho.push(nomeDisc);
        const avg = notas.reduce((acc, n) => acc + n, 0) / notas.length;
        dataDesempenho.push(Number(avg.toFixed(1)));
      });

      // Evolução de Notas (média geral por bimestre, com base em Aula.conteudo)
      const notasPorBimestre = {};
      avaliacoesComGrade.forEach(av => {
        const conteudo = av.aula?.conteudo || '';
        const match = conteudo.match(/([1-4])º?\s*Bimestre/i);
        if (match) {
          const bimestre = `${match[1]}º Bimestre`;
          if (!notasPorBimestre[bimestre]) {
            notasPorBimestre[bimestre] = [];
          }
          notasPorBimestre[bimestre].push(Number(av.nota || 0));
        }
      });

      const ordemBimestres = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const labelsEvolucao = [];
      const dataEvolucao = [];
      ordemBimestres.forEach(bimestre => {
        if (notasPorBimestre[bimestre]) {
          const notas = notasPorBimestre[bimestre];
          const avg = notas.reduce((acc, n) => acc + n, 0) / notas.length;
          labelsEvolucao.push(bimestre);
          dataEvolucao.push(Number(avg.toFixed(1)));
        }
      });

      // 5. Frequência Geral (Gráfico de Rosca/Pizza)
      const frequencias = await Frequencia.findAll({ where: whereAula });
      let presentes = 0;
      let totalFreq = frequencias.length;

      frequencias.forEach(f => {
        if (f.presente) presentes++;
      });

      let taxaPresenca = 0;
      let taxaFalta = 0;
      if (totalFreq > 0) {
        taxaPresenca = Math.round((presentes / totalFreq) * 100);
        taxaFalta = 100 - taxaPresenca;
      }

      return res.json({
        sucesso: true,
        dados: {
          totalAlunos,
          mediaGeral: mediaGeral.toFixed(1),
          alunosRisco,
          taxaAprovacao: `${taxaAprovacao}%`,
          desempenhoGeral: {
            labels: labelsDesempenho,
            datasets: [{
              label: 'Média por Disciplina',
              data: dataDesempenho,
              backgroundColor: '#3b82f6',
              borderRadius: 8
            }]
          },
          frequenciaGeral: {
            labels: ['Presença', 'Faltas'],
            datasets: [{
              data: [taxaPresenca, taxaFalta],
              backgroundColor: ['#10b981', '#f43f5e']
            }]
          },
          evolucaoNotas: {
            labels: labelsEvolucao,
            datasets: [{
              label: 'Média Geral',
              data: dataEvolucao,
              borderColor: '#2563eb',
              backgroundColor: '#2563eb',
              tension: 0.3
            }]
          }
        }
      });

    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter estatísticas.', detalhes: error.message });
    }
  }
};
