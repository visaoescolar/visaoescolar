const supabase = require("../config/supabase");

class DisciplinaService {
  static async obterTodos() {
    const { data, error } = await supabase.from("disciplinas").select("*");
    if (error) throw new Error(error.message);
    return data;
  }

  static async criar(dados) {
    const { data, error } = await supabase
      .from("disciplinas")
      .insert([{ nome: dados.nome, carga_horaria: dados.carga_horaria }])
      .select();
    if (error) throw error;
    return data[0];
  }
}
module.exports = DisciplinaService;
