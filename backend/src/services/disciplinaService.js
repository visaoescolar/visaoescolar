const mockDb = require('../database/mockDb');

class DisciplinaService {
  /**
   * Retorna todas as disciplinas
   * @returns {Array} Array de disciplinas
   */
  static obterTodos() {
    return mockDb.disciplinas;
  }

  /**
   * Retorna disciplinas por curso_id
   * @param {number} cursoId - ID do curso
   * @returns {Array} Array de disciplinas do curso
   */
  static obterPorCurso(cursoId) {
    return mockDb.disciplinas.filter(d => d.curso_id === parseInt(cursoId));
  }

  /**
   * Retorna uma disciplina por ID
   * @param {number} id - ID da disciplina
   * @returns {Object|null} Disciplina encontrada ou null
   */
  static obterPorId(id) {
    return mockDb.disciplinas.find(d => d.id === parseInt(id));
  }

  /**
   * Cria uma nova disciplina
   * @param {Object} dadosDisciplina - Dados da nova disciplina
   * @returns {Object} Disciplina criada
   */
  static criar(dadosDisciplina) {
    const novoId = Math.max(...mockDb.disciplinas.map(d => d.id), 0) + 1;
    
    const novaDisciplina = {
      id: novoId,
      nome: dadosDisciplina.nome,
      codigo: dadosDisciplina.codigo,
      carga_horaria: parseInt(dadosDisciplina.carga_horaria) || 60,
      curso_id: parseInt(dadosDisciplina.curso_id),
    };

    mockDb.disciplinas.push(novaDisciplina);
    return novaDisciplina;
  }

  /**
   * Atualiza uma disciplina existente
   * @param {number} id - ID da disciplina
   * @param {Object} dadosDisciplina - Dados a atualizar
   * @returns {Object|null} Disciplina atualizada ou null se não encontrada
   */
  static atualizar(id, dadosDisciplina) {
    const disciplina = this.obterPorId(id);
    if (!disciplina) return null;

    if (dadosDisciplina.nome) disciplina.nome = dadosDisciplina.nome;
    if (dadosDisciplina.codigo) disciplina.codigo = dadosDisciplina.codigo;
    if (dadosDisciplina.carga_horaria) disciplina.carga_horaria = parseInt(dadosDisciplina.carga_horaria);
    if (dadosDisciplina.curso_id) disciplina.curso_id = parseInt(dadosDisciplina.curso_id);

    return disciplina;
  }

  /**
   * Deleta uma disciplina
   * @param {number} id - ID da disciplina
   * @returns {boolean} true se deletada, false se não encontrada
   */
  static deletar(id) {
    const index = mockDb.disciplinas.findIndex(d => d.id === parseInt(id));
    
    if (index === -1) return false;

    mockDb.disciplinas.splice(index, 1);
    return true;
  }
}

module.exports = DisciplinaService;
