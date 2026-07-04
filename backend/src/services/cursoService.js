const mockDb = require('../database/mockDb');

class CursoService {
  /**
   * Retorna todos os cursos
   * @returns {Array} Array de cursos
   */
  static obterTodos() {
    return mockDb.cursos;
  }

  /**
   * Retorna um curso por ID
   * @param {number} id - ID do curso
   * @returns {Object|null} Curso encontrado ou null
   */
  static obterPorId(id) {
    return mockDb.cursos.find(curso => curso.id === parseInt(id));
  }

  /**
   * Cria um novo curso
   * @param {Object} dadosCurso - Dados do novo curso
   * @returns {Object} Curso criado
   */
  static criar(dadosCurso) {
    const novoId = Math.max(...mockDb.cursos.map(c => c.id), 0) + 1;
    
    const novoCurso = {
      id: novoId,
      nome: dadosCurso.nome,
      codigo: dadosCurso.codigo,
      descricao: dadosCurso.descricao || '',
    };

    mockDb.cursos.push(novoCurso);
    return novoCurso;
  }

  /**
   * Atualiza um curso existente
   * @param {number} id - ID do curso
   * @param {Object} dadosCurso - Dados a atualizar
   * @returns {Object|null} Curso atualizado ou null se não encontrado
   */
  static atualizar(id, dadosCurso) {
    const curso = this.obterPorId(id);
    if (!curso) return null;

    if (dadosCurso.nome) curso.nome = dadosCurso.nome;
    if (dadosCurso.codigo) curso.codigo = dadosCurso.codigo;
    if (dadosCurso.descricao !== undefined) curso.descricao = dadosCurso.descricao;

    return curso;
  }

  /**
   * Deleta um curso
   * @param {number} id - ID do curso
   * @returns {boolean} true se deletado, false se não encontrado
   */
  static deletar(id) {
    const index = mockDb.cursos.findIndex(c => c.id === parseInt(id));
    
    if (index === -1) return false;

    mockDb.cursos.splice(index, 1);
    return true;
  }
}

module.exports = CursoService;
