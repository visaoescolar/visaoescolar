const Aluno = require('../database/models/Aluno');
const Pessoa = require('../database/models/Pessoa');
const Usuario = require('../database/models/Usuario');
const Matricula = require('../database/models/Matricula');
const Grade = require('../database/models/Grade');
const GradeProfessor = require('../database/models/GradeProfessor');
const Aula = require('../database/models/Aula');
const Avaliacao = require('../database/models/Avaliacao');
const Frequencia = require('../database/models/Frequencia');
const Professor = require('../database/models/Professor');

module.exports = {
  // Obter planilha de notas e frequências
  async obterPlanilha(req, res) {
    try {
      const { turma_id, disciplina_id, periodo, usuario_id } = req.query;

      if (!turma_id || !disciplina_id || !periodo) {
        return res.status(400).json({ sucesso: false, mensagem: 'Turma, Disciplina e Período são obrigatórios.' });
      }

      // 1. Buscar a Grade correspondente
      const grade = await Grade.findOne({
        where: { id_turma: turma_id, id_disciplina: disciplina_id }
      });

      if (!grade) {
        return res.status(404).json({ sucesso: false, mensagem: 'Grade não encontrada para esta turma e disciplina.' });
      }

      // 2. Tentar buscar o GradeProfessor associado ao professor logado
      let gpId = null;
      if (usuario_id) {
        const pessoa = await Pessoa.findOne({ where: { id_usuario: usuario_id } });
        if (pessoa) {
          const professor = await Professor.findOne({ where: { id_pessoa: pessoa.id } });
          if (professor) {
            const gp = await GradeProfessor.findOne({
              where: { id_grade: grade.id, id_professor: professor.id }
            });
            if (gp) gpId = gp.id;
          }
        }
      }

      // Fallback se não achar GradeProfessor específico do professor logado
      if (!gpId) {
        const anyGp = await GradeProfessor.findOne({ where: { id_grade: grade.id } });
        if (anyGp) {
          gpId = anyGp.id;
        } else {
          // Criar uma GradeProfessor fictícia associada a qualquer professor para permitir o funcionamento
          const firstProf = await Professor.findOne() || { id: 1 };
          const createdGp = await GradeProfessor.create({
            id_grade: grade.id,
            id_professor: firstProf.id,
            ano_letivo: new Date().getFullYear(),
            qtd_aula: 4,
            status: 'Ativo'
          });
          gpId = createdGp.id;
        }
      }

      // 3. Buscar ou criar a Aula para o período
      const descricaoBimestre = `${periodo}º Bimestre`;
      let aula = await Aula.findOne({
        where: { id_grade_professor: gpId, conteudo: descricaoBimestre, tipo: 'avaliacao' }
      });

      if (!aula) {
        aula = await Aula.create({
          id_grade_professor: gpId,
          data_aula: new Date(),
          conteudo: descricaoBimestre,
          tipo: 'avaliacao'
        });
      }

      // 4. Buscar matrículas ativas para esta grade
      const matriculas = await Matricula.findAll({
        where: { id_grade: grade.id },
        include: [{
          model: Aluno,
          include: [{ model: Pessoa, as: 'pessoa' }]
        }]
      });

      // 5. Mapear os estudantes com suas notas e frequências reais
      const dadosPlanilha = [];
      for (const mat of matriculas) {
        const aluno = mat.aluno || {};
        const pessoa = aluno.pessoa || {};

        if (!aluno.id) continue;

        const avaliacao = await Avaliacao.findOne({
          where: { id_matricula: mat.id, id_aula: aula.id }
        });

        const frequenciaObj = await Frequencia.findOne({
          where: { id_matricula: mat.id, id_aula: aula.id }
        });

        let notaVal = null;
        if (avaliacao && avaliacao.nota !== null) {
          notaVal = parseFloat(avaliacao.nota);
        }

        let freqVal = null;
        if (frequenciaObj) {
          freqVal = frequenciaObj.observacao ? parseFloat(frequenciaObj.observacao) : (frequenciaObj.presente ? 100 : 0);
        }

        dadosPlanilha.push({
          id: aluno.id,
          matricula_id: mat.id,
          matricula: aluno.matricula || '',
          nome: pessoa.nome || 'Desconhecido',
          nota: notaVal,
          frequencia: freqVal
        });
      }

      return res.json({ sucesso: true, dados: dadosPlanilha });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter planilha.', detalhes: error.message });
    }
  },

  // Salvar/publicar notas e frequências
  async publicarPlanilha(req, res) {
    try {
      const { turma_id, disciplina_id, periodo, usuario_id, dados } = req.body;

      if (!turma_id || !disciplina_id || !periodo || !dados || !Array.isArray(dados)) {
        return res.status(400).json({ sucesso: false, mensagem: 'Parâmetros inválidos.' });
      }

      // 1. Buscar a Grade correspondente
      const grade = await Grade.findOne({
        where: { id_turma: turma_id, id_disciplina: disciplina_id }
      });

      if (!grade) {
        return res.status(404).json({ sucesso: false, mensagem: 'Grade não encontrada para esta turma e disciplina.' });
      }

      // 2. Tentar buscar o GradeProfessor associado ao professor logado
      let gpId = null;
      if (usuario_id) {
        const pessoa = await Pessoa.findOne({ where: { id_usuario: usuario_id } });
        if (pessoa) {
          const professor = await Professor.findOne({ where: { id_pessoa: pessoa.id } });
          if (professor) {
            const gp = await GradeProfessor.findOne({
              where: { id_grade: grade.id, id_professor: professor.id }
            });
            if (gp) gpId = gp.id;
          }
        }
      }

      // Fallback
      if (!gpId) {
        const anyGp = await GradeProfessor.findOne({ where: { id_grade: grade.id } });
        if (anyGp) {
          gpId = anyGp.id;
        } else {
          const firstProf = await Professor.findOne() || { id: 1 };
          const createdGp = await GradeProfessor.create({
            id_grade: grade.id,
            id_professor: firstProf.id,
            ano_letivo: new Date().getFullYear(),
            qtd_aula: 4,
            status: 'Ativo'
          });
          gpId = createdGp.id;
        }
      }

      // 3. Buscar ou criar a Aula para o período
      const descricaoBimestre = `${periodo}º Bimestre`;
      let aula = await Aula.findOne({
        where: { id_grade_professor: gpId, conteudo: descricaoBimestre, tipo: 'avaliacao' }
      });

      if (!aula) {
        aula = await Aula.create({
          id_grade_professor: gpId,
          data_aula: new Date(),
          conteudo: descricaoBimestre,
          tipo: 'avaliacao'
        });
      }

      // 4. Salvar dados de cada aluno
      for (const item of dados) {
        const { matricula_id, nota, frequencia } = item;

        if (!matricula_id) continue;

        // Atualizar ou criar Avaliacao
        if (nota !== null && nota !== undefined && nota !== '') {
          const [avaliacao] = await Avaliacao.findOrCreate({
            where: { id_matricula: matricula_id, id_aula: aula.id },
            defaults: {
              descricao: descricaoBimestre,
              nota: parseFloat(nota),
              data_avaliacao: new Date()
            }
          });
          if (avaliacao) {
            await avaliacao.update({
              nota: parseFloat(nota),
              data_avaliacao: new Date()
            });
          }
        }

        // Atualizar ou criar Frequencia
        if (frequencia !== null && frequencia !== undefined && frequencia !== '') {
          const [freqObj] = await Frequencia.findOrCreate({
            where: { id_matricula: matricula_id, id_aula: aula.id },
            defaults: {
              presente: parseFloat(frequencia) >= 75 ? 1 : 0,
              observacao: String(frequencia)
            }
          });
          if (freqObj) {
            await freqObj.update({
              presente: parseFloat(frequencia) >= 75 ? 1 : 0,
              observacao: String(frequencia)
            });
          }
        }
      }

      return res.json({ sucesso: true, mensagem: 'Notas e frequências salvas com sucesso no banco de dados!' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar dados.', detalhes: error.message });
    }
  },

  // Obter boletim consolidado (para a visão do professor)
  async obterBoletimConsolidado(req, res) {
    try {
      const { turma_id, disciplina_id } = req.query;

      if (!turma_id || !disciplina_id) {
        return res.status(400).json({ sucesso: false, mensagem: 'Turma e Disciplina são obrigatórios.' });
      }

      // 1. Buscar a Grade
      const grade = await Grade.findOne({
        where: { id_turma: turma_id, id_disciplina: disciplina_id }
      });

      if (!grade) {
        return res.status(404).json({ sucesso: false, mensagem: 'Grade não encontrada para esta turma e disciplina.' });
      }

      // 2. Encontrar todas as aulas vinculadas a esta grade
      const gradeProfessores = await GradeProfessor.findAll({
        where: { id_grade: grade.id }
      });
      const gpIds = gradeProfessores.map(gp => gp.id);

      const aulas = await Aula.findAll({
        where: { id_grade_professor: gpIds, tipo: 'avaliacao' }
      });
      const aulaIds = aulas.map(a => a.id);

      // 3. Buscar matrículas
      const matriculas = await Matricula.findAll({
        where: { id_grade: grade.id },
        include: [{
          model: Aluno,
          include: [{ model: Pessoa, as: 'pessoa' }]
        }]
      });

      const boletins = [];
      for (const mat of matriculas) {
        const aluno = mat.aluno || {};
        const pessoa = aluno.pessoa || {};

        if (!aluno.id) continue;

        // Buscar todas as avaliações desta matrícula para as aulas desta grade
        const avaliacoes = await Avaliacao.findAll({
          where: { id_matricula: mat.id, id_aula: aulaIds }
        });

        // Buscar todas as frequências desta matrícula para as aulas desta grade
        const frequencias = await Frequencia.findAll({
          where: { id_matricula: mat.id, id_aula: aulaIds }
        });

        // Mapear notas por bimestre
        let nota1 = 0;
        let nota2 = 0;
        let nota3 = 0;
        let nota4 = 0;

        let somaNotas = 0;
        let contNotas = 0;

        avaliacoes.forEach(av => {
          const notaVal = parseFloat(av.nota || 0);
          const desc = (av.descricao || '').toLowerCase();
          
          if (desc.includes('1º bimestre') || desc.includes('1o bimestre')) {
            nota1 = notaVal;
          } else if (desc.includes('2º bimestre') || desc.includes('2o bimestre')) {
            nota2 = notaVal;
          } else if (desc.includes('3º bimestre') || desc.includes('3o bimestre')) {
            nota3 = notaVal;
          } else if (desc.includes('4º bimestre') || desc.includes('4o bimestre')) {
            nota4 = notaVal;
          }

          somaNotas += notaVal;
          contNotas++;
        });

        // Calcular Média Final
        const mediaFinal = contNotas > 0 ? parseFloat((somaNotas / contNotas).toFixed(1)) : 0.0;

        // Calcular Frequência Média
        let somaFrequencia = 0;
        let contFrequencia = 0;
        frequencias.forEach(fr => {
          const freqVal = fr.observacao ? parseFloat(fr.observacao) : (fr.presente ? 100 : 0);
          somaFrequencia += freqVal;
          contFrequencia++;
        });

        const freqMedia = contFrequencia > 0 ? Math.round(somaFrequencia / contFrequencia) : 100; // Default a 100% se não houver registros

        // Determinar situação
        let situacao = 'Aprovado';
        if (mediaFinal < 4.0 || freqMedia < 75) {
          situacao = 'Reprovado';
        } else if (mediaFinal < 6.0) {
          situacao = 'Recuperação';
        }

        boletins.push({
          id: aluno.id,
          matricula_id: mat.id,
          matricula: aluno.matricula || '',
          nome: pessoa.nome || 'Desconhecido',
          nota1,
          nota2,
          nota3,
          nota4,
          mediaFinal,
          frequencia: freqMedia,
          situacao
        });
      }

      return res.json({ sucesso: true, dados: boletins });
    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter boletim consolidado.', detalhes: error.message });
    }
  }
};
