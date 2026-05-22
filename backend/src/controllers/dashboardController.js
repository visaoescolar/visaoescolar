const EstatisticasService = require('../services/estatisticasService');

class DashboardController {
  /**
   * GET /api/dashboard/estatisticas
   * Retorna estatísticas gerais das avaliações
   */
  static obterEstatisticas(req, res) {
    try {
      const estatisticas = EstatisticasService.obterEstatisticas();

      res.json({
        sucesso: true,
        dados: estatisticas,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter estatísticas',
        erro: erro.message,
      });
    }
  }

  /**
   * GET /api/dashboard/estatisticas/por-aluno
   * Retorna estatísticas das avaliações por aluno
   */
  static obterEstatisticasPorAluno(req, res) {
    try {
      const estatisticas = EstatisticasService.obterEstatisticasPorAluno();

      res.json({
        sucesso: true,
        dados: estatisticas,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter estatísticas por aluno',
        erro: erro.message,
      });
    }
  }

  /**
   * GET /api/dashboard/estatisticas/por-disciplina
   * Retorna estatísticas das avaliações por disciplina
   */
  static obterEstatisticasPorDisciplina(req, res) {
    try {
      const estatisticas = EstatisticasService.obterEstatisticasPorDisciplina();

      res.json({
        sucesso: true,
        dados: estatisticas,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter estatísticas por disciplina',
        erro: erro.message,
      });
    }
  }
}

module.exports = DashboardController;
