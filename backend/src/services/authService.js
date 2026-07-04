const mockDb = require("../database/mockDb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  static async login(email, senha) {
    // Find person by email
    const emailNormal = email.toLowerCase().trim();
    const pessoa = mockDb.pessoas.find(
      (p) => (p.email || "").toLowerCase().trim() === emailNormal
    );
    if (!pessoa) throw new Error("E-mail ou senha incorretos.");

    // Find user by person_id
    const usuario = mockDb.usuarios.find(
      (u) => u.pessoa_id === pessoa.id && u.ativo
    );
    if (!usuario) throw new Error("E-mail ou senha incorretos.");

    // Verify password (either the mock hash or allow '123' / 'senha123' as default)
    let senhaValida = false;
    try {
      senhaValida = await bcrypt.compare(senha, usuario.senha);
    } catch (e) {
      senhaValida = false;
    }
    
    // Fallback: allow common testing passwords
    if (!senhaValida && (senha === '123' || senha === 'senha123' || senha === '123456')) {
      senhaValida = true;
    }

    if (!senhaValida) throw new Error("E-mail ou senha incorretos.");

    const secret = process.env.JWT_SECRET || "seu_segredo_super_seguro";
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      secret,
      { expiresIn: "1d" }
    );

    const dadosUsuario = {
      id: usuario.id,
      nome: pessoa.nome,
      email: pessoa.email,
      tipo_usuario: usuario.tipo, // 'professor', 'coordenador', 'aluno', 'admin'
    };

    return { usuario: dadosUsuario, token };
  }

  static async registrar(dados) {
    // Check if email already exists in mock database
    const emailNormal = dados.email.toLowerCase().trim();
    const emailExists = mockDb.pessoas.some(
      (p) => (p.email || "").toLowerCase().trim() === emailNormal
    );
    if (emailExists) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    // 1. Create a person
    const newPersonId = Math.max(...mockDb.pessoas.map((p) => p.id), 0) + 1;
    const novaPessoa = {
      id: newPersonId,
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf || '',
      data_nascimento: dados.data_nasc || '',
    };
    mockDb.pessoas.push(novaPessoa);

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const senhaCripto = await bcrypt.hash(dados.senha, salt);

    // 3. Create a user
    const newUserId = Math.max(...mockDb.usuarios.map((u) => u.id), 0) + 1;
    const novoUsuario = {
      id: newUserId,
      pessoa_id: newPersonId,
      login: dados.email.split('@')[0],
      senha: senhaCripto,
      tipo: dados.tipo_usuario, // 'professor' or 'coordenador'
      ativo: true,
    };
    mockDb.usuarios.push(novoUsuario);

    return {
      id: novoUsuario.id,
      nome: novaPessoa.nome,
      email: novaPessoa.email,
      tipo_usuario: novoUsuario.tipo,
    };
  }
}

module.exports = AuthService;
