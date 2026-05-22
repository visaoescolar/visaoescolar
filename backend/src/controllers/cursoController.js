const CursoService = require('../services/cursoService');

class CursoController {
  /**
   * GET /api/cursos
   * Retorna todos os cursos
   */
  static listar(req, res) {
    try {
      const cursos = CursoService.obterTodos();
      res.json({
        sucesso: true,
        dados: cursos,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar cursos',
        erro: erro.message,
      });
    }
  }

  /**
   * GET /api/cursos/:id
   * Retorna um curso específico
   */
  static obterPorId(req, res) {
    try {
      const { id } = req.params;
      const curso = CursoService.obterPorId(id);

      if (!curso) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Curso não encontrado',
        });
      }

      res.json({
        sucesso: true,
        dados: curso,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter curso',
        erro: erro.message,
      });
    }
  }

  /**
   * POST /api/cursos
   * Cria um novo curso
   */
  static criar(req, res) {
    try {
      const { nome, codigo, descricao } = req.body;

      // Validações
      if (!nome || !codigo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome e código do curso são obrigatórios',
        });
      }

      // Verifica se o código já existe
      const cursoExistente = CursoService.obterTodos().find(
        c => c.codigo === codigo
      );
      if (cursoExistente) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Código de curso já existe',
        });
      }

      const novoCurso = CursoService.criar({
        nome,
        codigo,
        descricao,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Curso criado com sucesso',
        dados: novoCurso,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao criar curso',
        erro: erro.message,
      });
    }
  }

  /**
   * PUT /api/cursos/:id
   * Atualiza um curso existente
   */
  static atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, codigo, descricao } = req.body;

      const cursoAtualizado = CursoService.atualizar(id, {
        nome,
        codigo,
        descricao,
      });

      if (!cursoAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Curso não encontrado',
        });
      }

      res.json({
        sucesso: true,
        mensagem: 'Curso atualizado com sucesso',
        dados: cursoAtualizado,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar curso',
        erro: erro.message,
      });
    }
  }

  /**
   * DELETE /api/cursos/:id
   * Deleta um curso
   */
  static deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = CursoService.deletar(id);

      if (!deletado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Curso não encontrado',
        });
      }

      res.json({
        sucesso: true,
        mensagem: 'Curso deletado com sucesso',
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao deletar curso',
        erro: erro.message,
      });
    }
  }
}

module.exports = CursoController;
