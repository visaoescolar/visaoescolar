const Aluno = require('../database/models/Aluno');
const Pessoa = require('../database/models/Pessoa');
const Usuario = require('../database/models/Usuario');
const Matricula = require('../database/models/Matricula');
const Grade = require('../database/models/Grade');
const Curso = require('../database/models/Curso');
const Turma = require('../database/models/Turma');

module.exports = {
  // Criar Aluno (Cria Usuario, Pessoa, Aluno e vincula a uma Matricula/Grade)
  async criar(req, res) {
    try {
      const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        endereco,
        matricula,
        filiacao,
        data_ingresso,
        status_aluno,
        email,
        curso_id,
        turma_id
      } = req.body;

      if (!nome || !cpf || !matricula) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome, CPF e Matrícula são obrigatórios.' });
      }

      // 1. Cria um registro na tabela usuario (login = email) para obter o ID do usuário
      const loginEmail = email ? email.trim().toLowerCase() : `aluno.${matricula}@visaoescolar.com`;
      const [usuario] = await Usuario.findOrCreate({
        where: { login: loginEmail },
        defaults: {
          senha: '123456', // Senha padrão para alunos cadastrados manualmente
          status: 1,
          tipo: 'aluno'
        }
      });

      // 2. Cria o registro na tabela pessoa vinculado ao usuario
      const pessoa = await Pessoa.create({
        nome,
        cpf,
        data_nascimento: data_nascimento || null,
        telefone: telefone || '',
        endereco: endereco || '',
        status: 1,
        id_usuario: usuario.id
      });

      // 3. Cria o registro na tabela aluno usando o id da pessoa criada
      const aluno = await Aluno.create({
        id_pessoa: pessoa.id,
        matricula,
        filiacao: filiacao || '',
        data_ingresso: data_ingresso || new Date(),
        status_aluno: status_aluno || 'Ativo'
      });

      // 4. Cria a matrícula vinculando o aluno a uma grade do curso/turma selecionado
      const cursoIdInt = curso_id ? parseInt(curso_id) : 1;
      const turmaIdInt = turma_id ? parseInt(turma_id) : 1;

      // Buscar a grade correspondente para esse curso e turma
      let grade = await Grade.findOne({
        where: { id_curso: cursoIdInt, id_turma: turmaIdInt }
      });

      if (!grade) {
        // Fallback: busca qualquer grade para o curso, ou qualquer grade cadastrada
        grade = await Grade.findOne({ where: { id_curso: cursoIdInt } }) || await Grade.findOne();
      }

      if (grade) {
        await Matricula.create({
          id_aluno: aluno.id,
          id_grade: grade.id,
          data_matricula: data_ingresso || new Date(),
          status: 'Ativa'
        });
      }

      return res.status(201).json({
        sucesso: true,
        dados: { pessoa, aluno }
      });
    } catch (error) {
      return res.status(400).json({ sucesso: false, erro: 'Erro ao criar aluno', detalhes: error.message });
    }
  },

  // Listar todos os alunos trazendo os dados da pessoa e curso/turma estruturados
  async listar(req, res) {
    try {
      const alunos = await Aluno.findAll({
        include: [
          {
            model: Pessoa,
            as: 'pessoa',
            include: [{ model: Usuario, as: 'usuario' }]
          },
          {
            model: Matricula,
            as: 'matriculas',
            include: [{
              model: Grade,
              include: [
                { model: Curso },
                { model: Turma }
              ]
            }]
          }
        ]
      });

      const formatados = alunos.map(aluno => {
        const pessoa = aluno.pessoa || {};
        const usuario = pessoa.usuario || {};
        const matricula = aluno.matriculas && aluno.matriculas[0] || {};
        const grade = matricula.grade || {};
        const curso = grade.curso || {};
        const turma = grade.turma || {};

        return {
          id: aluno.id,
          pessoa_id: aluno.id_pessoa,
          matricula: aluno.matricula,
          filiacao: aluno.filiacao,
          data_ingresso: aluno.data_ingresso,
          status: aluno.status_aluno || 'Ativo',
          nome: pessoa.nome || 'Desconhecido',
          email: usuario.login || '',
          cpf: pessoa.cpf || '',
          data_nascimento: pessoa.data_nascimento || '',
          telefone: pessoa.telefone || '',
          endereco: pessoa.endereco || '',
          nome_curso: curso.descricao || 'N/A',
          nome_turma: turma.descricao || 'Sem turma',
          turma: turma.descricao || 'Sem turma'
        };
      });

      return res.json({ sucesso: true, dados: formatados });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao listar alunos', detalhes: error.message });
    }
  },

  // Buscar aluno por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const aluno = await Aluno.findByPk(id, {
        include: [
          {
            model: Pessoa,
            as: 'pessoa',
            include: [{ model: Usuario, as: 'usuario' }]
          },
          {
            model: Matricula,
            as: 'matriculas',
            include: [{
              model: Grade,
              include: [
                { model: Curso },
                { model: Turma }
              ]
            }]
          }
        ]
      });
      
      if (!aluno) return res.status(404).json({ sucesso: false, erro: 'Aluno não encontrado' });
      
      const pessoa = aluno.pessoa || {};
      const usuario = pessoa.usuario || {};
      const matricula = aluno.matriculas && aluno.matriculas[0] || {};
      const grade = matricula.grade || {};
      const curso = grade.curso || {};
      const turma = grade.turma || {};

      const formatado = {
        id: aluno.id,
        pessoa_id: aluno.id_pessoa,
        matricula: aluno.matricula,
        filiacao: aluno.filiacao,
        data_ingresso: aluno.data_ingresso,
        status: aluno.status_aluno || 'Ativo',
        nome: pessoa.nome || 'Desconhecido',
        email: usuario.login || '',
        cpf: pessoa.cpf || '',
        data_nascimento: pessoa.data_nascimento || '',
        telefone: pessoa.telefone || '',
        endereco: pessoa.endereco || '',
        nome_curso: curso.descricao || 'N/A',
        nome_turma: turma.descricao || 'Turma A',
        turma: turma.descricao || 'Turma A'
      };

      return res.json({ sucesso: true, dados: formatado });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar aluno', detalhes: error.message });
    }
  },

  // Atualizar Aluno
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { matricula, filiacao, status_aluno, nome, cpf, data_nascimento, telefone, endereco } = req.body;

      const aluno = await Aluno.findByPk(id, { include: [{ model: Pessoa, as: 'pessoa' }] });
      if (!aluno) return res.status(404).json({ sucesso: false, erro: 'Aluno não encontrado' });

      // Atualizar dados de aluno
      await aluno.update({ matricula, filiacao, status_aluno });

      // Atualizar dados de pessoa associada se enviados
      if (aluno.pessoa) {
        await aluno.pessoa.update({
          nome: nome || aluno.pessoa.nome,
          cpf: cpf || aluno.pessoa.cpf,
          data_nascimento: data_nascimento || aluno.pessoa.data_nascimento,
          telefone: telefone || aluno.pessoa.telefone,
          endereco: endereco || aluno.pessoa.endereco
        });
      }

      return res.json({ sucesso: true, mensagem: 'Aluno atualizado com sucesso', aluno });
    } catch (error) {
      return res.status(400).json({ sucesso: false, erro: 'Erro ao atualizar aluno', detalhes: error.message });
    }
  },

  // Deletar Aluno
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const aluno = await Aluno.findByPk(id);
      
      if (!aluno) return res.status(404).json({ sucesso: false, erro: 'Aluno não encontrado' });

      // Exclui matrículas vinculadas primeiro
      await Matricula.destroy({ where: { id_aluno: aluno.id } });

      const pessoaId = aluno.id_pessoa;
      await aluno.destroy();

      // Opcional: deleta também a pessoa e o usuário
      if (pessoaId) {
        const pessoa = await Pessoa.findByPk(pessoaId);
        if (pessoa) {
          const usuarioId = pessoa.id_usuario;
          await pessoa.destroy();
          if (usuarioId) {
            await Usuario.destroy({ where: { id: usuarioId } });
          }
        }
      }

      return res.json({ sucesso: true, mensagem: 'Aluno removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao deletar aluno', detalhes: error.message });
    }
  }
};