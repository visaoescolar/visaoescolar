const supabase = require("../config/supabase");

class AlunoService {
  static async obterTodos() {
    // Buscamos apenas o que é garantido: Aluno e seu Usuário
    const { data, error } = await supabase.from("alunos").select(`
        id,
        matricula,
        usuarios (
          nome,
          email
        )
      `);

    if (error) {
      console.error("Erro no Supabase:", error.message);
      throw new Error(error.message);
    }

    // Usamos o operador ?. (Optional Chaining) para evitar que o código quebre
    // caso algum dado venha faltando
    return data.map((item) => ({
      id: item.id,
      nome: item.usuarios?.nome || "Sem nome",
      email: item.usuarios?.email || "Sem email",
      matricula: item.matricula || "S/M",
      turma: "9º Ano A",
      media: 0, // Deixamos 0 por enquanto para estabilizar o sistema
    }));
  }
}

module.exports = AlunoService;
