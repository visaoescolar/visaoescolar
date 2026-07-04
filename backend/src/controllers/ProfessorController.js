const Professor = require('../database/models/Professor');
const Pessoa = require('../database/models/Pessoa');
const Usuario = require('../database/models/Usuario');
const GradeProfessor = require('../database/models/GradeProfessor');
const Grade = require('../database/models/Grade');
const Turma = require('../database/models/Turma');
const Disciplina = require('../database/models/Disciplina');
const bcrypt = require('bcryptjs');

module.exports = {
  // Criar Professor completo + vínculo com curso/disciplina
  async criar(req, res) {
    try {
      const {
        nome,
        cpf,
        email,
        senha,
        curso_id,
        disciplina_id
      } = req.body;

      if (!nome || !cpf || !email || !senha) {
        return res.status(400).json({ sucesso: false, erro: 'Nome, CPF, E-mail e Senha são obrigatórios.' });
      }

      // 1. Verificar se o e-mail já existe
      const usuarioExistente = await Usuario.findOne({
        where: { login: email.trim().toLowerCase() }
      });

      if (usuarioExistente) {
        return res.status(400).json({ sucesso: false, erro: 'Este e-mail já está cadastrado.' });
      }

      // 2. Criptografar senha
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // 3. Criar Usuário
      const usuario = await Usuario.create({
        login: email.trim().toLowerCase(),
        senha: senhaCriptografada,
        status: 1,
        tipo: 'professor'
      });

      // 4. Criar Pessoa
      const pessoa = await Pessoa.create({
        nome,
        cpf,
        data_nascimento: null,
        telefone: '',
        endereco: '',
        status: 1,
        id_usuario: usuario.id
      });

      // 5. Criar Professor
      const professor = await Professor.create({
        id_pessoa: pessoa.id,
        formacao: 'Graduação',
        especializacao: 'Docência',
        data_admissao: new Date()
      });

      // 6. Vincular a Curso e Disciplina via Grade/GradeProfessor (se existirem)
      const cursoIdInt = parseInt(curso_id);
      const disciplinaIdInt = parseInt(disciplina_id);

      if (cursoIdInt && disciplinaIdInt) {
        // Encontrar uma grade que tenha esse curso e disciplina
        let grade = await Grade.findOne({
          where: { id_curso: cursoIdInt, id_disciplina: disciplinaIdInt }
        });

        if (!grade) {
          // Fallback: busca qualquer grade para o curso, ou qualquer grade cadastrada no banco
          grade = await Grade.findOne({ where: { id_curso: cursoIdInt } }) || await Grade.findOne();
        }

        if (grade) {
          // Criar o vínculo GradeProfessor
          await GradeProfessor.create({
            id_grade: grade.id,
            id_professor: professor.id,
            ano_letivo: new Date().getFullYear(),
            qtd_aula: 4,
            status: 'Ativo'
          });
        }
      }

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Professor cadastrado com sucesso!',
        dados: { professor, pessoa }
      });
    } catch (error) {
      return res.status(400).json({ sucesso: false, erro: 'Erro ao criar professor', detalhes: error.message });
    }
  },

  // Listar todos os professores com vínculos de turma/disciplina
  async listar(req, res) {
    try {
      const professores = await Professor.findAll({ include: [{ model: Pessoa, as: 'pessoa' }] });

      const formatados = await Promise.all(professores.map(async (professor) => {
        const pessoa = professor.pessoa || {};
        const usuario = pessoa.id_usuario ? await Usuario.findByPk(pessoa.id_usuario) : null;

        const gradeProfessores = await GradeProfessor.findAll({
          where: { id_professor: professor.id },
          include: [{
            model: Grade,
            include: [{ model: Turma }, { model: Disciplina }]
          }]
        });

        const vinculos = gradeProfessores.map(gp => {
          const grade = gp.grade || {};
          const turma = grade.turma || {};
          const disciplina = grade.disciplina || {};
          return `${turma.descricao || 'Turma'} - ${disciplina.descricao || 'Disciplina'}`;
        });

        return {
          id: professor.id,
          pessoa_id: pessoa.id,
          nome: pessoa.nome || 'Desconhecido',
          cpf: pessoa.cpf || '',
          email: usuario ? usuario.login : '',
          status: (pessoa.status === 1 && (!usuario || usuario.status === 1)) ? 'Ativo' : 'Desligado',
          formacao: professor.formacao,
          especializacao: professor.especializacao,
          data_admissao: professor.data_admissao,
          vinculos
        };
      }));

      return res.json({ sucesso: true, dados: formatados });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao listar professores', detalhes: error.message });
    }
  },

  // Obter turmas e disciplinas vinculadas a um professor a partir de seu id_usuario
  async obterTurmas(req, res) {
    try {
      const { usuarioId } = req.params;

      // 1. Encontrar Pessoa pelo ID do usuário
      const pessoa = await Pessoa.findOne({ where: { id_usuario: usuarioId } });
      if (!pessoa) {
        return res.status(404).json({ sucesso: false, erro: 'Pessoa não encontrada para este usuário.' });
      }

      // 2. Encontrar Professor correspondente
      const professor = await Professor.findOne({ where: { id_pessoa: pessoa.id } });
      if (!professor) {
        return res.status(404).json({ sucesso: false, erro: 'Professor não registrado.' });
      }

      // 3. Buscar relações de grade
      const gradeProfessores = await GradeProfessor.findAll({
        where: { id_professor: professor.id },
        include: [{
          model: Grade,
          include: [
            { model: Turma },
            { model: Disciplina }
          ]
        }]
      });

      // 4. Formatar resposta
      const turmasEDisciplinas = gradeProfessores.map(gp => {
        const grade = gp.grade || {};
        const turma = grade.turma || {};
        const disciplina = grade.disciplina || {};
        return {
          grade_professor_id: gp.id,
          turma_id: turma.id,
          turma_descricao: turma.descricao || 'Sem turma',
          disciplina_id: disciplina.id,
          disciplina_descricao: disciplina.descricao || 'Sem disciplina'
        };
      });

      return res.json({ sucesso: true, dados: turmasEDisciplinas });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao obter turmas do professor', detalhes: error.message });
    }
  },

  // Atualizar dados do Professor/Pessoa
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cpf, telefone, endereco, formacao, especializacao } = req.body;

      const professor = await Professor.findByPk(id, { include: [{ model: Pessoa, as: 'pessoa' }] });
      if (!professor) return res.status(404).json({ sucesso: false, erro: 'Professor não encontrado' });

      await professor.update({
        formacao: formacao || professor.formacao,
        especializacao: especializacao || professor.especializacao
      });

      if (professor.pessoa) {
        await professor.pessoa.update({
          nome: nome || professor.pessoa.nome,
          cpf: cpf || professor.pessoa.cpf,
          telefone: telefone || professor.pessoa.telefone,
          endereco: endereco || professor.pessoa.endereco
        });
      }

      return res.json({ sucesso: true, mensagem: 'Professor atualizado com sucesso', dados: professor });
    } catch (error) {
      return res.status(400).json({ sucesso: false, erro: 'Erro ao atualizar professor', detalhes: error.message });
    }
  },

  // Desligar Professor (soft-delete via status de Pessoa/Usuario, preserva histórico de notas/turmas)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const professor = await Professor.findByPk(id, { include: [{ model: Pessoa, as: 'pessoa' }] });

      if (!professor) return res.status(404).json({ sucesso: false, erro: 'Professor não encontrado' });

      if (professor.pessoa) {
        await professor.pessoa.update({ status: 0 });
        if (professor.pessoa.id_usuario) {
          await Usuario.update({ status: 0 }, { where: { id: professor.pessoa.id_usuario } });
        }
      }

      return res.json({ sucesso: true, mensagem: 'Professor desligado com sucesso' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao desligar professor', detalhes: error.message });
    }
  }
};
