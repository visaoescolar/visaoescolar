/**
 * Mock Database
 * Arquivo contendo dados fictícios para desenvolvimento e testes
 * Segue a estrutura de um sistema de monitoramento acadêmico
 */

// ============================================================================
// TABELAS BASE
// ============================================================================

/**
 * Array de Cursos
 * @type {Array<{id: number, nome: string, codigo: string, descricao: string}>}
 */
const cursos = [
  {
    id: 1,
    nome: 'Ensino Médio Regular',
    codigo: 'EM_REG',
    descricao: 'Ensino Médio com formação geral e preparação para o ENEM'
  },
  {
    id: 2,
    nome: 'Ensino Médio Técnico',
    codigo: 'EM_TEC',
    descricao: 'Ensino Médio integrado com formação técnica profissional'
  }
];

/**
 * Array de Disciplinas
 * @type {Array<{id: number, nome: string, codigo: string, carga_horaria: number, curso_id: number}>}
 */
const disciplinas = [
  {
    id: 1,
    nome: 'Matemática',
    codigo: 'MAT',
    carga_horaria: 120,
    curso_id: 1
  },
  {
    id: 2,
    nome: 'Português',
    codigo: 'PORT',
    carga_horaria: 120,
    curso_id: 1
  },
  {
    id: 3,
    nome: 'Física',
    codigo: 'FIS',
    carga_horaria: 80,
    curso_id: 1
  },
  {
    id: 4,
    nome: 'Química',
    codigo: 'QUIM',
    carga_horaria: 80,
    curso_id: 1
  },
  {
    id: 5,
    nome: 'Biologia',
    codigo: 'BIO',
    carga_horaria: 80,
    curso_id: 1
  },
  {
    id: 6,
    nome: 'História',
    codigo: 'HIST',
    carga_horaria: 80,
    curso_id: 1
  },
  {
    id: 7,
    nome: 'Geografia',
    codigo: 'GEO',
    carga_horaria: 80,
    curso_id: 1
  },
  {
    id: 8,
    nome: 'Sociologia',
    codigo: 'SOC',
    carga_horaria: 40,
    curso_id: 1
  },
  {
    id: 9,
    nome: 'Filosofia',
    codigo: 'FIL',
    carga_horaria: 40,
    curso_id: 1
  },
  {
    id: 10,
    nome: 'Educação Física',
    codigo: 'EDUC_FIS',
    carga_horaria: 60,
    curso_id: 1
  },
  {
    id: 11,
    nome: 'Arte',
    codigo: 'ARTE',
    carga_horaria: 40,
    curso_id: 1
  },
  {
    id: 12,
    nome: 'Inglês',
    codigo: 'INGL',
    carga_horaria: 60,
    curso_id: 1
  },
  // Disciplinas do Ensino Médio Técnico (inclui as mesmas + técnicas)
  {
    id: 13,
    nome: 'Matemática',
    codigo: 'MAT_TEC',
    carga_horaria: 120,
    curso_id: 2
  },
  {
    id: 14,
    nome: 'Português',
    codigo: 'PORT_TEC',
    carga_horaria: 120,
    curso_id: 2
  },
  {
    id: 15,
    nome: 'Física',
    codigo: 'FIS_TEC',
    carga_horaria: 100,
    curso_id: 2
  }
];

/**
 * Array de Turmas
 * @type {Array<{id: number, nome: string, codigo: string, curso_id: number, periodo: number, ano: number}>}
 */
const turmas = [
  {
    id: 1,
    nome: '1º Ano A',
    codigo: 'EM_1A',
    curso_id: 1,
    periodo: 1,
    ano: 2024
  },
  {
    id: 2,
    nome: '1º Ano B',
    codigo: 'EM_1B',
    curso_id: 1,
    periodo: 1,
    ano: 2024
  },
  {
    id: 3,
    nome: '2º Ano A',
    codigo: 'EM_2A',
    curso_id: 1,
    periodo: 1,
    ano: 2024
  },
  {
    id: 4,
    nome: '2º Ano B',
    codigo: 'EM_2B',
    curso_id: 1,
    periodo: 2,
    ano: 2024
  },
  {
    id: 5,
    nome: '3º Ano A',
    codigo: 'EM_3A',
    curso_id: 1,
    periodo: 1,
    ano: 2024
  },
  {
    id: 6,
    nome: '1º Ano Técnico',
    codigo: 'TEC_1A',
    curso_id: 2,
    periodo: 1,
    ano: 2024
  }
];

/**
 * Array de Períodos (Bimestral)
 * @type {Array<{id: number, nome: string, inicio: string, fim: string}>}
 */
const periodos = [
  {
    id: 1,
    nome: '1º Bimestre',
    inicio: '2024-02-01',
    fim: '2024-03-31'
  },
  {
    id: 2,
    nome: '2º Bimestre',
    inicio: '2024-04-01',
    fim: '2024-05-31'
  },
  {
    id: 3,
    nome: '3º Bimestre',
    inicio: '2024-06-01',
    fim: '2024-07-31'
  },
  {
    id: 4,
    nome: '4º Bimestre',
    inicio: '2024-08-01',
    fim: '2024-09-30'
  }
];

/**
 * Array de Semestres (Bimestres do Ensino Médio)
 * @type {Array<{id: number, nome: string, ano: number, semestre: number, data_inicio: string, data_fim: string}>}
 */
const semestres = [
  {
    id: 1,
    nome: '2024 - 1º Bimestre',
    ano: 2024,
    semestre: 1,
    data_inicio: '2024-02-01',
    data_fim: '2024-03-31'
  },
  {
    id: 2,
    nome: '2024 - 2º Bimestre',
    ano: 2024,
    semestre: 2,
    data_inicio: '2024-04-01',
    data_fim: '2024-05-31'
  },
  {
    id: 3,
    nome: '2024 - 3º Bimestre',
    ano: 2024,
    semestre: 3,
    data_inicio: '2024-06-01',
    data_fim: '2024-07-31'
  },
  {
    id: 4,
    nome: '2024 - 4º Bimestre',
    ano: 2024,
    semestre: 4,
    data_inicio: '2024-08-01',
    data_fim: '2024-09-30'
  }
];

// ============================================================================
// PESSOAS (Base para usuários, alunos e professores)
// ============================================================================

/**
 * Array de Pessoas
 * @type {Array<{id: number, nome: string, cpf: string, email: string, data_nascimento: string, telefone: string, endereco: string}>}
 */
const pessoas = [
  // Professores
  {
    id: 1,
    nome: 'Prof. Carlos Alberto Silva',
    cpf: '12345678901',
    email: 'carlos.silva@escola.com',
    data_nascimento: '1980-03-15',
    telefone: '11987654321',
    endereco: 'Rua A, 100, São Paulo, SP'
  },
  {
    id: 2,
    nome: 'Prof. Mariana Oliveira Santos',
    cpf: '12345678902',
    email: 'mariana.santos@escola.com',
    data_nascimento: '1985-07-22',
    telefone: '11987654322',
    endereco: 'Rua B, 200, São Paulo, SP'
  },
  {
    id: 3,
    nome: 'Prof. Roberto Costa Ferreira',
    cpf: '12345678903',
    email: 'roberto.costa@escola.com',
    data_nascimento: '1978-11-10',
    telefone: '11987654323',
    endereco: 'Rua C, 300, São Paulo, SP'
  },
  {
    id: 4,
    nome: 'Prof. Juliana Pereira Gomes',
    cpf: '12345678904',
    email: 'juliana.gomes@escola.com',
    data_nascimento: '1988-01-05',
    telefone: '11987654324',
    endereco: 'Rua D, 400, São Paulo, SP'
  },
  {
    id: 5,
    nome: 'Prof. Marcelo Torres Alves',
    cpf: '12345678905',
    email: 'marcelo.torres@escola.com',
    data_nascimento: '1982-05-20',
    telefone: '11987654325',
    endereco: 'Rua E, 500, São Paulo, SP'
  },
  {
    id: 6,
    nome: 'Prof. Anita Ribeiro Silva',
    cpf: '12345678906',
    email: 'anita.ribeiro@escola.com',
    data_nascimento: '1986-09-12',
    telefone: '11987654326',
    endereco: 'Rua F, 600, São Paulo, SP'
  },
  // Alunos - 1º Ano A (turma_id: 1)
  {
    id: 7,
    nome: 'João Pedro Alves',
    cpf: '98765432101',
    email: 'joao.alves@aluno.com',
    data_nascimento: '2006-05-18',
    telefone: '11999999001',
    endereco: 'Rua G, 700, São Paulo, SP'
  },
  {
    id: 8,
    nome: 'Ana Silva Costa',
    cpf: '98765432102',
    email: 'ana.costa@aluno.com',
    data_nascimento: '2006-09-25',
    telefone: '11999999002',
    endereco: 'Rua H, 800, São Paulo, SP'
  },
  {
    id: 9,
    nome: 'Bruno Martins Oliveira',
    cpf: '98765432103',
    email: 'bruno.martins@aluno.com',
    data_nascimento: '2007-02-14',
    telefone: '11999999003',
    endereco: 'Rua I, 900, São Paulo, SP'
  },
  {
    id: 10,
    nome: 'Fernanda Rocha Dias',
    cpf: '98765432104',
    email: 'fernanda.rocha@aluno.com',
    data_nascimento: '2006-12-03',
    telefone: '11999999004',
    endereco: 'Rua J, 1000, São Paulo, SP'
  },
  // Alunos - 1º Ano B (turma_id: 2)
  {
    id: 11,
    nome: 'Lucas Santos Barbosa',
    cpf: '98765432105',
    email: 'lucas.barbosa@aluno.com',
    data_nascimento: '2007-06-20',
    telefone: '11999999005',
    endereco: 'Rua K, 1100, São Paulo, SP'
  },
  {
    id: 12,
    nome: 'Camila Mendes Garcia',
    cpf: '98765432106',
    email: 'camila.garcia@aluno.com',
    data_nascimento: '2006-08-11',
    telefone: '11999999006',
    endereco: 'Rua L, 1200, São Paulo, SP'
  },
  {
    id: 13,
    nome: 'Rafael Gomes Souza',
    cpf: '98765432107',
    email: 'rafael.souza@aluno.com',
    data_nascimento: '2007-04-07',
    telefone: '11999999007',
    endereco: 'Rua M, 1300, São Paulo, SP'
  },
  {
    id: 14,
    nome: 'Isabela Ribeiro Torres',
    cpf: '98765432108',
    email: 'isabela.torres@aluno.com',
    data_nascimento: '2006-10-30',
    telefone: '11999999008',
    endereco: 'Rua N, 1400, São Paulo, SP'
  },
  // Alunos - 2º Ano A (turma_id: 3)
  {
    id: 15,
    nome: 'Gabriel Mendonça Silva',
    cpf: '98765432109',
    email: 'gabriel.mendonca@aluno.com',
    data_nascimento: '2005-03-17',
    telefone: '11999999009',
    endereco: 'Rua O, 1500, São Paulo, SP'
  },
  {
    id: 16,
    nome: 'Patricia Almeida Costa',
    cpf: '98765432110',
    email: 'patricia.almeida@aluno.com',
    data_nascimento: '2005-07-28',
    telefone: '11999999010',
    endereco: 'Rua P, 1600, São Paulo, SP'
  },
  // Alunos - 2º Ano B (turma_id: 4)
  {
    id: 17,
    nome: 'Victor Henrique Rojas',
    cpf: '98765432111',
    email: 'victor.rojas@aluno.com',
    data_nascimento: '2005-11-02',
    telefone: '11999999011',
    endereco: 'Rua Q, 1700, São Paulo, SP'
  },
  {
    id: 18,
    nome: 'Livia Martins Pereira',
    cpf: '98765432112',
    email: 'livia.martins@aluno.com',
    data_nascimento: '2006-01-14',
    telefone: '11999999012',
    endereco: 'Rua R, 1800, São Paulo, SP'
  },
  // Alunos - 3º Ano A (turma_id: 5)
  {
    id: 19,
    nome: 'Diego Ferreira Oliveira',
    cpf: '98765432113',
    email: 'diego.ferreira@aluno.com',
    data_nascimento: '2005-08-21',
    telefone: '11999999013',
    endereco: 'Rua S, 1900, São Paulo, SP'
  },
  {
    id: 20,
    nome: 'Beatriz Neves Miranda',
    cpf: '98765432114',
    email: 'beatriz.neves@aluno.com',
    data_nascimento: '2005-04-10',
    telefone: '11999999014',
    endereco: 'Rua T, 2000, São Paulo, SP'
  }
];

// ============================================================================
// USUÁRIOS (Para login, vinculado a uma pessoa)
// ============================================================================

/**
 * Array de Usuários
 * @type {Array<{id: number, pessoa_id: number, login: string, senha: string, tipo: string, ativo: boolean, data_criacao: string}>}
 */
const usuarios = [
  // Admin
  {
    id: 1,
    pessoa_id: 1,
    login: 'carlos.silva',
    senha: '$2a$10$hashedpassword123', // senha: senha123
    tipo: 'admin',
    ativo: true,
    data_criacao: '2024-01-15'
  },
  // Professores
  {
    id: 2,
    pessoa_id: 2,
    login: 'mariana.santos',
    senha: '$2a$10$hashedpassword456',
    tipo: 'professor',
    ativo: true,
    data_criacao: '2024-01-15'
  },
  {
    id: 3,
    pessoa_id: 3,
    login: 'roberto.costa',
    senha: '$2a$10$hashedpassword789',
    tipo: 'professor',
    ativo: true,
    data_criacao: '2024-01-15'
  },
  {
    id: 4,
    pessoa_id: 4,
    login: 'juliana.gomes',
    senha: '$2a$10$hashedpassword101',
    tipo: 'professor',
    ativo: true,
    data_criacao: '2024-01-15'
  },
  {
    id: 5,
    pessoa_id: 5,
    login: 'marcelo.torres',
    senha: '$2a$10$hashedpassword102',
    tipo: 'professor',
    ativo: true,
    data_criacao: '2024-01-15'
  },
  {
    id: 6,
    pessoa_id: 6,
    login: 'anita.ribeiro',
    senha: '$2a$10$hashedpassword103',
    tipo: 'professor',
    ativo: true,
    data_criacao: '2024-01-15'
  },
  // Alunos
  {
    id: 7,
    pessoa_id: 7,
    login: 'joao.alves',
    senha: '$2a$10$hashedpassword104',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 8,
    pessoa_id: 8,
    login: 'ana.costa',
    senha: '$2a$10$hashedpassword105',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 9,
    pessoa_id: 9,
    login: 'bruno.martins',
    senha: '$2a$10$hashedpassword106',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 10,
    pessoa_id: 10,
    login: 'fernanda.rocha',
    senha: '$2a$10$hashedpassword107',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 11,
    pessoa_id: 11,
    login: 'lucas.barbosa',
    senha: '$2a$10$hashedpassword108',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 12,
    pessoa_id: 12,
    login: 'camila.garcia',
    senha: '$2a$10$hashedpassword109',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 13,
    pessoa_id: 13,
    login: 'rafael.souza',
    senha: '$2a$10$hashedpassword110',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 14,
    pessoa_id: 14,
    login: 'isabela.torres',
    senha: '$2a$10$hashedpassword111',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 15,
    pessoa_id: 15,
    login: 'gabriel.mendonca',
    senha: '$2a$10$hashedpassword112',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 16,
    pessoa_id: 16,
    login: 'patricia.almeida',
    senha: '$2a$10$hashedpassword113',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 17,
    pessoa_id: 17,
    login: 'victor.rojas',
    senha: '$2a$10$hashedpassword114',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 18,
    pessoa_id: 18,
    login: 'livia.martins',
    senha: '$2a$10$hashedpassword115',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 19,
    pessoa_id: 19,
    login: 'diego.ferreira',
    senha: '$2a$10$hashedpassword116',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  },
  {
    id: 20,
    pessoa_id: 20,
    login: 'beatriz.neves',
    senha: '$2a$10$hashedpassword117',
    tipo: 'aluno',
    ativo: true,
    data_criacao: '2024-02-01'
  }
];

// ============================================================================
// ALUNOS (Vinculado a uma pessoa)
// ============================================================================

/**
 * Array de Alunos
 * @type {Array<{id: number, pessoa_id: number, matricula: string, curso_id: number, turma_id: number, data_ingresso: string, status: string}>}
 */
const alunos = [
  // 1º Ano A (turma_id: 1)
  {
    id: 1,
    pessoa_id: 7,
    matricula: 'EM241001',
    curso_id: 1,
    turma_id: 1,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  {
    id: 2,
    pessoa_id: 8,
    matricula: 'EM241002',
    curso_id: 1,
    turma_id: 1,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  {
    id: 3,
    pessoa_id: 9,
    matricula: 'EM241003',
    curso_id: 1,
    turma_id: 1,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  {
    id: 4,
    pessoa_id: 10,
    matricula: 'EM241004',
    curso_id: 1,
    turma_id: 1,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  // 1º Ano B (turma_id: 2)
  {
    id: 5,
    pessoa_id: 11,
    matricula: 'EM241005',
    curso_id: 1,
    turma_id: 2,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  {
    id: 6,
    pessoa_id: 12,
    matricula: 'EM241006',
    curso_id: 1,
    turma_id: 2,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  {
    id: 7,
    pessoa_id: 13,
    matricula: 'EM241007',
    curso_id: 1,
    turma_id: 2,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  {
    id: 8,
    pessoa_id: 14,
    matricula: 'EM241008',
    curso_id: 1,
    turma_id: 2,
    data_ingresso: '2024-02-01',
    status: 'ativo'
  },
  // 2º Ano A (turma_id: 3)
  {
    id: 9,
    pessoa_id: 15,
    matricula: 'EM242001',
    curso_id: 1,
    turma_id: 3,
    data_ingresso: '2023-02-01',
    status: 'ativo'
  },
  {
    id: 10,
    pessoa_id: 16,
    matricula: 'EM242002',
    curso_id: 1,
    turma_id: 3,
    data_ingresso: '2023-02-01',
    status: 'ativo'
  },
  // 2º Ano B (turma_id: 4)
  {
    id: 11,
    pessoa_id: 17,
    matricula: 'EM242003',
    curso_id: 1,
    turma_id: 4,
    data_ingresso: '2023-02-01',
    status: 'ativo'
  },
  {
    id: 12,
    pessoa_id: 18,
    matricula: 'EM242004',
    curso_id: 1,
    turma_id: 4,
    data_ingresso: '2023-02-01',
    status: 'ativo'
  },
  // 3º Ano A (turma_id: 5)
  {
    id: 13,
    pessoa_id: 19,
    matricula: 'EM243001',
    curso_id: 1,
    turma_id: 5,
    data_ingresso: '2022-02-01',
    status: 'ativo'
  },
  {
    id: 14,
    pessoa_id: 20,
    matricula: 'EM243002',
    curso_id: 1,
    turma_id: 5,
    data_ingresso: '2022-02-01',
    status: 'ativo'
  }
];

// ============================================================================
// AVALIAÇÕES (Notas para o dashboard)
// ============================================================================

/**
 * Array de Avaliações
 * Contém notas variadas para cálculo de estatísticas
 * @type {Array<{id: number, aluno_id: number, disciplina_id: number, professor_id: number, nota: number, data_avaliacao: string, tipo_avaliacao: string}>}
 */
const avaliacoes = [
  // ========== ALUNO 1 (João - 1º Ano A) ==========
  // Matemática
  { id: 1, aluno_id: 1, disciplina_id: 1, professor_id: 1, nota: 7.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 2, aluno_id: 1, disciplina_id: 1, professor_id: 1, nota: 8.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  { id: 3, aluno_id: 1, disciplina_id: 1, professor_id: 1, nota: 7.0, data_avaliacao: '2024-05-10', tipo_avaliacao: 'Participação' },
  // Português
  { id: 4, aluno_id: 1, disciplina_id: 2, professor_id: 2, nota: 8.5, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  { id: 5, aluno_id: 1, disciplina_id: 2, professor_id: 2, nota: 8.0, data_avaliacao: '2024-04-25', tipo_avaliacao: 'Redação' },
  // Física
  { id: 6, aluno_id: 1, disciplina_id: 3, professor_id: 3, nota: 6.5, data_avaliacao: '2024-03-22', tipo_avaliacao: 'Prova' },
  { id: 7, aluno_id: 1, disciplina_id: 3, professor_id: 3, nota: 7.0, data_avaliacao: '2024-04-28', tipo_avaliacao: 'Experimento' },

  // ========== ALUNO 2 (Ana - 1º Ano A) ==========
  // Matemática
  { id: 8, aluno_id: 2, disciplina_id: 1, professor_id: 1, nota: 5.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 9, aluno_id: 2, disciplina_id: 1, professor_id: 1, nota: 6.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  { id: 10, aluno_id: 2, disciplina_id: 1, professor_id: 1, nota: 5.8, data_avaliacao: '2024-05-10', tipo_avaliacao: 'Participação' },
  // Português
  { id: 11, aluno_id: 2, disciplina_id: 2, professor_id: 2, nota: 9.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  { id: 12, aluno_id: 2, disciplina_id: 2, professor_id: 2, nota: 8.5, data_avaliacao: '2024-04-25', tipo_avaliacao: 'Redação' },
  // Química
  { id: 13, aluno_id: 2, disciplina_id: 4, professor_id: 4, nota: 4.5, data_avaliacao: '2024-03-20', tipo_avaliacao: 'Prova' },
  { id: 14, aluno_id: 2, disciplina_id: 4, professor_id: 4, nota: 5.0, data_avaliacao: '2024-04-22', tipo_avaliacao: 'Experimento' },

  // ========== ALUNO 3 (Bruno - 1º Ano A) ==========
  // Matemática
  { id: 15, aluno_id: 3, disciplina_id: 1, professor_id: 1, nota: 9.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 16, aluno_id: 3, disciplina_id: 1, professor_id: 1, nota: 9.8, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  { id: 17, aluno_id: 3, disciplina_id: 1, professor_id: 1, nota: 10.0, data_avaliacao: '2024-05-10', tipo_avaliacao: 'Participação' },
  // Português
  { id: 18, aluno_id: 3, disciplina_id: 2, professor_id: 2, nota: 8.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Biologia
  { id: 19, aluno_id: 3, disciplina_id: 5, professor_id: 5, nota: 9.0, data_avaliacao: '2024-03-25', tipo_avaliacao: 'Prova' },
  { id: 20, aluno_id: 3, disciplina_id: 5, professor_id: 5, nota: 8.5, data_avaliacao: '2024-04-30', tipo_avaliacao: 'Seminário' },

  // ========== ALUNO 4 (Fernanda - 1º Ano A) ==========
  // Matemática
  { id: 21, aluno_id: 4, disciplina_id: 1, professor_id: 1, nota: 6.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 22, aluno_id: 4, disciplina_id: 1, professor_id: 1, nota: 7.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 23, aluno_id: 4, disciplina_id: 2, professor_id: 2, nota: 7.5, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // História
  { id: 24, aluno_id: 4, disciplina_id: 6, professor_id: 6, nota: 8.0, data_avaliacao: '2024-03-28', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 5 (Lucas - 1º Ano B) ==========
  // Matemática
  { id: 25, aluno_id: 5, disciplina_id: 1, professor_id: 1, nota: 8.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 26, aluno_id: 5, disciplina_id: 1, professor_id: 1, nota: 9.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 27, aluno_id: 5, disciplina_id: 2, professor_id: 2, nota: 7.5, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Física
  { id: 28, aluno_id: 5, disciplina_id: 3, professor_id: 3, nota: 8.0, data_avaliacao: '2024-03-22', tipo_avaliacao: 'Prova' },
  { id: 29, aluno_id: 5, disciplina_id: 3, professor_id: 3, nota: 8.5, data_avaliacao: '2024-04-28', tipo_avaliacao: 'Experimento' },

  // ========== ALUNO 6 (Camila - 1º Ano B) ==========
  // Matemática
  { id: 30, aluno_id: 6, disciplina_id: 1, professor_id: 1, nota: 4.0, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 31, aluno_id: 6, disciplina_id: 1, professor_id: 1, nota: 4.5, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  { id: 32, aluno_id: 6, disciplina_id: 1, professor_id: 1, nota: 5.0, data_avaliacao: '2024-05-10', tipo_avaliacao: 'Participação' },
  // Português
  { id: 33, aluno_id: 6, disciplina_id: 2, professor_id: 2, nota: 6.5, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Geografia
  { id: 34, aluno_id: 6, disciplina_id: 7, professor_id: 5, nota: 7.0, data_avaliacao: '2024-03-30', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 7 (Rafael - 1º Ano B) ==========
  // Matemática
  { id: 35, aluno_id: 7, disciplina_id: 1, professor_id: 1, nota: 7.0, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 36, aluno_id: 7, disciplina_id: 1, professor_id: 1, nota: 7.5, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 37, aluno_id: 7, disciplina_id: 2, professor_id: 2, nota: 8.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Inglês
  { id: 38, aluno_id: 7, disciplina_id: 12, professor_id: 4, nota: 6.5, data_avaliacao: '2024-04-05', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 8 (Isabela - 1º Ano B) ==========
  // Matemática
  { id: 39, aluno_id: 8, disciplina_id: 1, professor_id: 1, nota: 9.0, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 40, aluno_id: 8, disciplina_id: 1, professor_id: 1, nota: 9.5, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 41, aluno_id: 8, disciplina_id: 2, professor_id: 2, nota: 9.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Sociologia
  { id: 42, aluno_id: 8, disciplina_id: 8, professor_id: 6, nota: 8.5, data_avaliacao: '2024-04-10', tipo_avaliacao: 'Seminário' },

  // ========== ALUNO 9 (Gabriel - 2º Ano A) ==========
  // Matemática
  { id: 43, aluno_id: 9, disciplina_id: 1, professor_id: 1, nota: 6.0, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 44, aluno_id: 9, disciplina_id: 1, professor_id: 1, nota: 6.5, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Física
  { id: 45, aluno_id: 9, disciplina_id: 3, professor_id: 3, nota: 5.5, data_avaliacao: '2024-03-22', tipo_avaliacao: 'Prova' },
  { id: 46, aluno_id: 9, disciplina_id: 3, professor_id: 3, nota: 6.0, data_avaliacao: '2024-04-28', tipo_avaliacao: 'Experimento' },
  // Química
  { id: 47, aluno_id: 9, disciplina_id: 4, professor_id: 4, nota: 6.5, data_avaliacao: '2024-03-20', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 10 (Patricia - 2º Ano A) ==========
  // Matemática
  { id: 48, aluno_id: 10, disciplina_id: 1, professor_id: 1, nota: 8.0, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 49, aluno_id: 10, disciplina_id: 1, professor_id: 1, nota: 8.5, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 50, aluno_id: 10, disciplina_id: 2, professor_id: 2, nota: 9.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Biologia
  { id: 51, aluno_id: 10, disciplina_id: 5, professor_id: 5, nota: 8.5, data_avaliacao: '2024-03-25', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 11 (Victor - 2º Ano B) ==========
  // Matemática
  { id: 52, aluno_id: 11, disciplina_id: 1, professor_id: 1, nota: 3.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 53, aluno_id: 11, disciplina_id: 1, professor_id: 1, nota: 4.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  { id: 54, aluno_id: 11, disciplina_id: 1, professor_id: 1, nota: 4.5, data_avaliacao: '2024-05-10', tipo_avaliacao: 'Participação' },
  // Português
  { id: 55, aluno_id: 11, disciplina_id: 2, professor_id: 2, nota: 5.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Física
  { id: 56, aluno_id: 11, disciplina_id: 3, professor_id: 3, nota: 3.5, data_avaliacao: '2024-03-22', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 12 (Livia - 2º Ano B) ==========
  // Matemática
  { id: 57, aluno_id: 12, disciplina_id: 1, professor_id: 1, nota: 9.0, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 58, aluno_id: 12, disciplina_id: 1, professor_id: 1, nota: 9.5, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  { id: 59, aluno_id: 12, disciplina_id: 1, professor_id: 1, nota: 10.0, data_avaliacao: '2024-05-10', tipo_avaliacao: 'Participação' },
  // Português
  { id: 60, aluno_id: 12, disciplina_id: 2, professor_id: 2, nota: 8.5, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // História
  { id: 61, aluno_id: 12, disciplina_id: 6, professor_id: 6, nota: 9.0, data_avaliacao: '2024-03-28', tipo_avaliacao: 'Prova' },

  // ========== ALUNO 13 (Diego - 3º Ano A) ==========
  // Matemática
  { id: 62, aluno_id: 13, disciplina_id: 1, professor_id: 1, nota: 7.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 63, aluno_id: 13, disciplina_id: 1, professor_id: 1, nota: 8.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 64, aluno_id: 13, disciplina_id: 2, professor_id: 2, nota: 7.0, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Filosofia
  { id: 65, aluno_id: 13, disciplina_id: 9, professor_id: 2, nota: 8.0, data_avaliacao: '2024-04-15', tipo_avaliacao: 'Dissertação' },

  // ========== ALUNO 14 (Beatriz - 3º Ano A) ==========
  // Matemática
  { id: 66, aluno_id: 14, disciplina_id: 1, professor_id: 1, nota: 8.5, data_avaliacao: '2024-03-15', tipo_avaliacao: 'Prova' },
  { id: 67, aluno_id: 14, disciplina_id: 1, professor_id: 1, nota: 9.0, data_avaliacao: '2024-04-20', tipo_avaliacao: 'Trabalho' },
  // Português
  { id: 68, aluno_id: 14, disciplina_id: 2, professor_id: 2, nota: 9.5, data_avaliacao: '2024-03-18', tipo_avaliacao: 'Prova' },
  // Biologia
  { id: 69, aluno_id: 14, disciplina_id: 5, professor_id: 5, nota: 9.0, data_avaliacao: '2024-03-25', tipo_avaliacao: 'Prova' },
  // História
  { id: 70, aluno_id: 14, disciplina_id: 6, professor_id: 6, nota: 8.5, data_avaliacao: '2024-03-28', tipo_avaliacao: 'Prova' }
];

// ============================================================================
// EXPORTAÇÃO
// ============================================================================

/**
 * Objeto mockDb contendo todas as tabelas do banco de dados
 * Utilizado para desenvolvimento e testes da aplicação
 */
const mockDb = {
  cursos,
  disciplinas,
  turmas,
  periodos,
  semestres,
  pessoas,
  usuarios,
  alunos,
  avaliacoes
};

module.exports = mockDb;
