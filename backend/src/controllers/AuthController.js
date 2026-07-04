const Usuario = require('../database/models/Usuario');
const Pessoa = require('../database/models/Pessoa');
const Professor = require('../database/models/Professor');
const Coordenador = require('../database/models/Coordenador');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');

module.exports = {
  // Login de usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' });
      }

      // Buscar usuário pelo login (que guarda o e-mail no script original)
      const usuario = await Usuario.findOne({
        where: { login: email.trim().toLowerCase() }
      });

      if (!usuario || usuario.status === 0) {
        return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' });
      }

      // Validar senha: apoia texto plano (seed) e hash bcrypt (cadastrados novos)
      let senhaValida = false;
      if (usuario.senha === senha) {
        senhaValida = true;
      } else {
        try {
          senhaValida = await bcrypt.compare(senha, usuario.senha);
        } catch (e) {
          senhaValida = false;
        }
      }

      if (!senhaValida) {
        return res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' });
      }

      // Buscar a pessoa associada ao usuário para obter o nome
      const pessoa = await Pessoa.findOne({
        where: { id_usuario: usuario.id }
      });

      // Determinar o papel (tipo) de forma simplificada
      let tipoUsuario = usuario.tipo;
      if (!tipoUsuario) {
        // Fallback: se não estiver preenchido o campo tipo, verificar nas tabelas correspondentes
        if (pessoa) {
          const coordenador = await Coordenador.findOne({ where: { id_pessoa: pessoa.id } });
          if (coordenador) {
            tipoUsuario = 'coordenador';
          } else {
            tipoUsuario = 'professor';
          }
        } else {
          tipoUsuario = 'professor';
        }
      }

      // Gerar Token JWT
      const token = jwt.sign(
        { id: usuario.id, tipo: tipoUsuario },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      const dadosUsuario = {
        id: usuario.id,
        nome: pessoa ? pessoa.nome : (email.split('@')[0]),
        email: email,
        tipo_usuario: tipoUsuario
      };

      return res.json({
        sucesso: true,
        dados: {
          token,
          usuario: dadosUsuario
        }
      });

    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.', detalhes: error.message });
    }
  },

  // Registrar novo usuário
  async registrar(req, res) {
    try {
      const { nome, email, senha, tipo_usuario } = req.body;

      if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios.' });
      }

      // Verificar se o login/e-mail já existe
      const usuarioExistente = await Usuario.findOne({
        where: { login: email.trim().toLowerCase() }
      });

      if (usuarioExistente) {
        return res.status(400).json({ sucesso: false, mensagem: 'Este e-mail já está cadastrado.' });
      }

      // Criptografar senha
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // 1. Criar Usuario
      const usuario = await Usuario.create({
        login: email.trim().toLowerCase(),
        senha: senhaCriptografada,
        status: 1,
        tipo: tipo_usuario
      });

      // 2. Criar Pessoa vinculada ao usuário
      // Nota: CPF e telefones padrões/vazios para o formulário simples de cadastro
      // Geramos um CPF único aleatório para evitar a violação da restrição de valor único (unique key) no MySQL
      const cpfAleatorio = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const pessoa = await Pessoa.create({
        nome,
        cpf: cpfAleatorio,
        data_nascimento: null,
        telefone: '',
        endereco: '',
        status: 1,
        id_usuario: usuario.id
      });

      // 3. Criar entrada na tabela específica do papel
      if (tipo_usuario === 'coordenador') {
        const Curso = require('../database/models/Curso');
        const primeiroCurso = await Curso.findOne() || { id: null };
        await Coordenador.create({
          id_pessoa: pessoa.id,
          id_curso: primeiroCurso.id,
          titulacao: 'Coordenador',
          data_inicio: new Date()
        });
      } else if (tipo_usuario === 'professor') {
        await Professor.create({
          id_pessoa: pessoa.id,
          formacao: 'Graduação',
          especializacao: 'Docência',
          data_admissao: new Date()
        });
      }

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Cadastro realizado com sucesso!',
        dados: {
          id: usuario.id,
          nome: pessoa.nome,
          email: usuario.login,
          tipo_usuario: usuario.tipo
        }
      });

    } catch (error) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar usuário.', detalhes: error.message });
    }
  }
};
