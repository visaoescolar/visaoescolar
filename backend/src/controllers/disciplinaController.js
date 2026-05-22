const DisciplinaService = require('../services/disciplinaService');

class DisciplinaController {
  /**
   * GET /api/disciplinas
   * Retorna todas as disciplinas
   */
  static listar(req, res) {
    try {
      const disciplinas = DisciplinaService.obterTodos();
      res.json({
        sucesso: true,
        dados: disciplinas,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar disciplinas',
        erro: erro.message,
      });
    }
  }

  /**
   * GET /api/disciplinas/curso/:cursoId
   * Retorna disciplinas por curso
   */
  static listarPorCurso(req, res) {
    try {
      const { cursoId } = req.params;
      const disciplinas = DisciplinaService.obterPorCurso(cursoId);

      res.json({
        sucesso: true,
        dados: disciplinas,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar disciplinas do curso',
        erro: erro.message,
      });
    }
  }

  /**
   * GET /api/disciplinas/:id
   * Retorna uma disciplina específica
   */
  static obterPorId(req, res) {
    try {
      const { id } = req.params;
      const disciplina = DisciplinaService.obterPorId(id);

      if (!disciplina) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Disciplina não encontrada',
        });
      }

      res.json({
        sucesso: true,
        dados: disciplina,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter disciplina',
        erro: erro.message,
      });
    }
  }

  /**
   * POST /api/disciplinas
   * Cria uma nova disciplina
   */
  static criar(req, res) {
    try {
      const { nome, codigo, carga_horaria, curso_id } = req.body;

      // Validações
      if (!nome || !codigo || !curso_id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome, código e curso_id são obrigatórios',
        });
      }

      // Verifica se o código já existe
      const disciplinaExistente = DisciplinaService.obterTodos().find(
        d => d.codigo === codigo
      );
      if (disciplinaExistente) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Código de disciplina já existe',
        });
      }

      const novaDisciplina = DisciplinaService.criar({
        nome,
        codigo,
        carga_horaria,
        curso_id,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Disciplina criada com sucesso',
        dados: novaDisciplina,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao criar disciplina',
        erro: erro.message,
      });
    }
  }

  /**
   * PUT /api/disciplinas/:id
   * Atualiza uma disciplina existente
   */
  static atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, codigo, carga_horaria, curso_id } = req.body;

      const disciplinaAtualizada = DisciplinaService.atualizar(id, {
        nome,
        codigo,
        carga_horaria,
        curso_id,
      });

      if (!disciplinaAtualizada) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Disciplina não encontrada',
        });
      }

      res.json({
        sucesso: true,
        mensagem: 'Disciplina atualizada com sucesso',
        dados: disciplinaAtualizada,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar disciplina',
        erro: erro.message,
      });
    }
  }

  /**
   * DELETE /api/disciplinas/:id
   * Deleta uma disciplina
   */
  static deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = DisciplinaService.deletar(id);

      if (!deletado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Disciplina não encontrada',
        });
      }

      res.json({
        sucesso: true,
        mensagem: 'Disciplina deletada com sucesso',
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao deletar disciplina',
        erro: erro.message,
      });
    }
  }
}

module.exports = DisciplinaController;
