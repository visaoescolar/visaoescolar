const mockDb = require('../database/mockDb');

class EstatisticasService {
  /**
   * Calcula a mediana de um array de números
   * @param {Array<number>} numeros - Array de números
   * @returns {number} A mediana
   */
  static calcularMediana(numeros) {
    if (numeros.length === 0) return 0;

    const sorted = [...numeros].sort((a, b) => a - b);
    const meio = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[meio - 1] + sorted[meio]) / 2;
    } else {
      return sorted[meio];
    }
  }

  /**
   * Calcula a média aritmética de um array de números
   * @param {Array<number>} numeros - Array de números
   * @returns {number} A média
   */
  static calcularMedia(numeros) {
    if (numeros.length === 0) return 0;
    const soma = numeros.reduce((acc, num) => acc + num, 0);
    return soma / numeros.length;
  }

  /**
   * Retorna estatísticas das avaliações
   * @returns {Object} Objeto com as estatísticas
   */
  static obterEstatisticas() {
    const avaliacoes = mockDb.avaliacoes;

    if (!avaliacoes || avaliacoes.length === 0) {
      return {
        total: 0,
        minima: 0,
        maxima: 0,
        media: 0,
        mediana: 0,
        mensagem: 'Nenhuma avaliação cadastrada'
      };
    }

    const notas = avaliacoes.map(av => av.nota);
    const minima = Math.min(...notas);
    const maxima = Math.max(...notas);
    const media = this.calcularMedia(notas);
    const mediana = this.calcularMediana(notas);

    return {
      total: avaliacoes.length,
      minima: Number(minima.toFixed(2)),
      maxima: Number(maxima.toFixed(2)),
      media: Number(media.toFixed(2)),
      mediana: Number(mediana.toFixed(2))
    };
  }

  /**
   * Retorna estatísticas de avaliações por aluno
   * @returns {Array<Object>} Array com estatísticas de cada aluno
   */
  static obterEstatisticasPorAluno() {
    const avaliacoes = mockDb.avaliacoes;
    const alunos = mockDb.alunos;

    const estatisticasPorAluno = {};

    // Agrupar avaliações por aluno
    avaliacoes.forEach(av => {
      if (!estatisticasPorAluno[av.aluno_id]) {
        estatisticasPorAluno[av.aluno_id] = [];
      }
      estatisticasPorAluno[av.aluno_id].push(av.nota);
    });

    // Processar e retornar
    return Object.entries(estatisticasPorAluno).map(([alunoId, notas]) => {
      const aluno = alunos.find(a => a.id === parseInt(alunoId));
      const pessoa = mockDb.pessoas.find(p => p.id === aluno?.pessoa_id);

      return {
        aluno_id: parseInt(alunoId),
        nome_aluno: pessoa?.nome || 'Desconhecido',
        matricula: aluno?.matricula || 'N/A',
        total_avaliacoes: notas.length,
        media: Number(this.calcularMedia(notas).toFixed(2)),
        mediana: Number(this.calcularMediana(notas).toFixed(2)),
        minima: Number(Math.min(...notas).toFixed(2)),
        maxima: Number(Math.max(...notas).toFixed(2))
      };
    });
  }

  /**
   * Retorna estatísticas de avaliações por disciplina
   * @returns {Array<Object>} Array com estatísticas de cada disciplina
   */
  static obterEstatisticasPorDisciplina() {
    const avaliacoes = mockDb.avaliacoes;
    const disciplinas = mockDb.disciplinas;

    const estatisticasPorDisciplina = {};

    // Agrupar avaliações por disciplina
    avaliacoes.forEach(av => {
      if (!estatisticasPorDisciplina[av.disciplina_id]) {
        estatisticasPorDisciplina[av.disciplina_id] = [];
      }
      estatisticasPorDisciplina[av.disciplina_id].push(av.nota);
    });

    // Processar e retornar
    return Object.entries(estatisticasPorDisciplina).map(([disciplinaId, notas]) => {
      const disciplina = disciplinas.find(d => d.id === parseInt(disciplinaId));

      return {
        disciplina_id: parseInt(disciplinaId),
        nome_disciplina: disciplina?.nome || 'Desconhecida',
        codigo: disciplina?.codigo || 'N/A',
        total_avaliacoes: notas.length,
        media: Number(this.calcularMedia(notas).toFixed(2)),
        mediana: Number(this.calcularMediana(notas).toFixed(2)),
        minima: Number(Math.min(...notas).toFixed(2)),
        maxima: Number(Math.max(...notas).toFixed(2))
      };
    });
  }
}

module.exports = EstatisticasService;
