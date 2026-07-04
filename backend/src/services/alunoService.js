const mockDb = require('../database/mockDb');

class AlunoService {
  static obterTodos() {
    return mockDb.alunos.map(aluno => {
      const pessoa = mockDb.pessoas.find(p => p.id === aluno.pessoa_id) || {};
      const curso = mockDb.cursos.find(c => c.id === aluno.curso_id) || {};
      const turma = mockDb.turmas.find(t => t.id === aluno.turma_id) || {};
      
      return {
        id: aluno.id,
        pessoa_id: aluno.pessoa_id,
        matricula: aluno.matricula,
        curso_id: aluno.curso_id,
        turma_id: aluno.turma_id,
        nome: pessoa.nome || 'Desconhecido',
        email: pessoa.email || '',
        cpf: pessoa.cpf || '',
        data_nascimento: pessoa.data_nascimento || '',
        telefone: pessoa.telefone || '',
        endereco: pessoa.endereco || '',
        nome_curso: curso.nome || 'N/A',
        nome_turma: turma.nome || 'N/A',
        turma: turma.nome || '1º Ano A', // fallback for UI
        status: aluno.status || 'ativo'
      };
    });
  }

  static obterPorId(id) {
    const aluno = mockDb.alunos.find(a => a.id === parseInt(id));
    if (!aluno) return null;

    const pessoa = mockDb.pessoas.find(p => p.id === aluno.pessoa_id) || {};
    const curso = mockDb.cursos.find(c => c.id === aluno.curso_id) || {};
    const turma = mockDb.turmas.find(t => t.id === aluno.turma_id) || {};

    return {
      id: aluno.id,
      pessoa_id: aluno.pessoa_id,
      matricula: aluno.matricula,
      curso_id: aluno.curso_id,
      turma_id: aluno.turma_id,
      nome: pessoa.nome || 'Desconhecido',
      email: pessoa.email || '',
      cpf: pessoa.cpf || '',
      data_nascimento: pessoa.data_nascimento || '',
      telefone: pessoa.telefone || '',
      endereco: pessoa.endereco || '',
      nome_curso: curso.nome || 'N/A',
      nome_turma: turma.nome || 'N/A',
      turma: turma.nome || '1º Ano A',
      status: aluno.status || 'ativo'
    };
  }

  static criar(dados) {
    // 1. Criar Pessoa
    const pessoaId = Math.max(...mockDb.pessoas.map(p => p.id), 0) + 1;
    const novaPessoa = {
      id: pessoaId,
      nome: dados.nome,
      cpf: dados.cpf || '',
      email: dados.email || '',
      data_nascimento: dados.data_nascimento || '',
      telefone: dados.telefone || '',
      endereco: dados.endereco || ''
    };
    mockDb.pessoas.push(novaPessoa);

    // 2. Criar Usuário
    const usuarioId = Math.max(...mockDb.usuarios.map(u => u.id), 0) + 1;
    const loginPrefix = dados.email ? dados.email.split('@')[0] : `aluno${pessoaId}`;
    const novoUsuario = {
      id: usuarioId,
      pessoa_id: pessoaId,
      login: loginPrefix,
      senha: '$2a$10$hashedpassworddefault', // senha padrão
      tipo: 'aluno',
      ativo: true,
      data_criacao: new Date().toISOString().split('T')[0]
    };
    mockDb.usuarios.push(novoUsuario);

    // 3. Criar Aluno
    const alunoId = Math.max(...mockDb.alunos.map(a => a.id), 0) + 1;
    const novoAluno = {
      id: alunoId,
      pessoa_id: pessoaId,
      matricula: dados.matricula,
      curso_id: parseInt(dados.curso_id || 1),
      turma_id: dados.turma_id ? parseInt(dados.turma_id) : 1,
      data_ingresso: new Date().toISOString().split('T')[0],
      status: 'ativo'
    };
    mockDb.alunos.push(novoAluno);

    const curso = mockDb.cursos.find(c => c.id === novoAluno.curso_id) || {};
    const turma = mockDb.turmas.find(t => t.id === novoAluno.turma_id) || {};

    return {
      id: novoAluno.id,
      pessoa_id: pessoaId,
      matricula: novoAluno.matricula,
      curso_id: novoAluno.curso_id,
      turma_id: novoAluno.turma_id,
      nome: novaPessoa.nome,
      email: novaPessoa.email,
      cpf: novaPessoa.cpf,
      data_nascimento: novaPessoa.data_nascimento,
      telefone: novaPessoa.telefone,
      endereco: novaPessoa.endereco,
      nome_curso: curso.nome || 'N/A',
      nome_turma: turma.nome || 'N/A',
      turma: turma.nome || '1º Ano A',
      status: novoAluno.status
    };
  }

  static deletar(id) {
    const alunoIndex = mockDb.alunos.findIndex(a => a.id === parseInt(id));
    if (alunoIndex === -1) return false;

    const aluno = mockDb.alunos[alunoIndex];
    
    // Remover de alunos
    mockDb.alunos.splice(alunoIndex, 1);

    // Remover de usuarios
    const usuarioIndex = mockDb.usuarios.findIndex(u => u.pessoa_id === aluno.pessoa_id);
    if (usuarioIndex !== -1) {
      mockDb.usuarios.splice(usuarioIndex, 1);
    }

    // Remover de pessoas
    const pessoaIndex = mockDb.pessoas.findIndex(p => p.id === aluno.pessoa_id);
    if (pessoaIndex !== -1) {
      mockDb.pessoas.splice(pessoaIndex, 1);
    }

    return true;
  }
}

module.exports = AlunoService;
