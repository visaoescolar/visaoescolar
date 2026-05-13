-- Criação do Banco de Dados
CREATE DATABASE sistema_escolar_v2;
USE sistema_escolar_v2;

-- Tabela de Usuários com Auditoria e Soft Delete
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('admin', 'coordenador', 'professor', 'aluno') NOT NULL,
    fk_criador INT,
    doc_identificacao VARCHAR(50) UNIQUE,
    telefone VARCHAR(20),
    data_nasc DATE,
    ativo BOOLEAN DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido_em DATETIME DEFAULT NULL,
    FOREIGN KEY (fk_criador) REFERENCES usuarios(id)
);

-- Especializações (Herança)
CREATE TABLE coordenadores (
    id INT PRIMARY KEY,
    departamento VARCHAR(50),
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE professores (
    id INT PRIMARY KEY,
    especialidade VARCHAR(50),
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE alunos (
    id INT PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Estrutura Acadêmica
CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    ano_letivo INT NOT NULL,
    status ENUM('ativa', 'concluida', 'cancelada') DEFAULT 'ativa'
);

-- Tabela de Histórico de Matrículas (Nova: Resolve o problema multi-ano)
CREATE TABLE matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_aluno INT,
    fk_turma INT,
    data_matricula DATE DEFAULT (CURRENT_DATE),
    status_aluno ENUM('matriculado', 'evadido', 'aprovado', 'reprovado') DEFAULT 'matriculado',
    FOREIGN KEY (fk_aluno) REFERENCES alunos(id),
    FOREIGN KEY (fk_turma) REFERENCES turmas(id)
);

CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INT
);

CREATE TABLE periodos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL
);

-- Grade Escolar (N:N entre Prof, Disc e Turma)
CREATE TABLE grade_escolar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_professor INT,
    fk_disciplina INT,
    fk_turma INT,
    FOREIGN KEY (fk_professor) REFERENCES professores(id),
    FOREIGN KEY (fk_disciplina) REFERENCES disciplinas(id),
    FOREIGN KEY (fk_turma) REFERENCES turmas(id)
);

-- Registro de Notas (Agora vinculado à Matrícula e Grade)
CREATE TABLE notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_matricula INT,
    fk_grade_escolar INT,
    fk_periodo INT,
    valor_nota DECIMAL(5,2) NOT NULL CHECK (valor_nota BETWEEN 0 AND 10),
    criado_por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_matricula) REFERENCES matriculas(id),
    FOREIGN KEY (fk_grade_escolar) REFERENCES grade_escolar(id),
    FOREIGN KEY (fk_periodo) REFERENCES periodos(id),
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- Registro de Frequência
CREATE TABLE frequencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_matricula INT,
    fk_grade_escolar INT,
    data_aula DATE NOT NULL,
    presenca BOOLEAN DEFAULT 1,
    FOREIGN KEY (fk_matricula) REFERENCES matriculas(id),
    FOREIGN KEY (fk_grade_escolar) REFERENCES grade_escolar(id)
);
