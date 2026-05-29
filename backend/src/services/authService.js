const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  static async login(email, senha) {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .eq("ativo", true)
      .single();

    if (error || !usuario) throw new Error("E-mail ou senha incorretos.");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("E-mail ou senha incorretos.");

    const secret = process.env.JWT_SECRET || "seu_segredo_super_seguro";
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo_usuario },
      secret,
      { expiresIn: "1d" },
    );

    const { senha: _, ...dadosUsuario } = usuario;
    return { usuario: dadosUsuario, token };
  }

  static async registrar(dados) {
    // 1. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCripto = await bcrypt.hash(dados.senha, salt);

    // 2. Inserir na tabela base USUARIOS
    const { data: novoUsuario, error: errorUser } = await supabase
      .from("usuarios")
      .insert([
        {
          nome: dados.nome,
          email: dados.email,
          senha: senhaCripto,
          tipo_usuario: dados.tipo_usuario, // 'professor' ou 'coordenador'
          telefone: dados.telefone || null,
          data_nasc: dados.data_nasc || null,
          ativo: true,
          // fk_criador pode ficar null por enquanto para permitir o primeiro cadastro
        },
      ])
      .select()
      .single();

    if (errorUser) {
      // Se o erro for de e-mail duplicado
      if (errorUser.code === "23505")
        throw new Error("Este e-mail já está cadastrado.");
      throw new Error("Erro ao criar usuário: " + errorUser.message);
    }

    // 3. Inserir na tabela específica (Especialização)
    if (dados.tipo_usuario === "professor") {
      const { error: errProf } = await supabase.from("professores").insert([
        {
          id: novoUsuario.id,
          especialidade: dados.especialidade || "Geral",
        },
      ]);

      if (errProf)
        throw new Error("Erro ao vincular como Professor: " + errProf.message);
    } else if (dados.tipo_usuario === "coordenador") {
      const { error: errCoord } = await supabase.from("coordenadores").insert([
        {
          id: novoUsuario.id,
          departamento: dados.departamento || "Administrativo",
        },
      ]);

      if (errCoord)
        throw new Error(
          "Erro ao vincular como Coordenador: " + errCoord.message,
        );
    }

    // Nota: Não incluímos 'aluno' aqui conforme seu pedido
    return novoUsuario;
  }
}

module.exports = AuthService;
