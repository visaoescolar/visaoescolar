-- 1. Criar Tipos ENUM (Postgres exige que criemos o tipo antes de usar na tabela)
CREATE TYPE tipo_usuario_enum AS ENUM ('admin', 'coordenador', 'professor', 'aluno');
CREATE TYPE status_turma_enum AS ENUM ('ativa', 'concluida', 'cancelada');
CREATE TYPE status_aluno_enum AS ENUM ('matriculado', 'evadido', 'aprovado', 'reprovado');

-- 2. Tabela de Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario tipo_usuario_enum NOT NULL,
    fk_criador INT,
    doc_identificacao VARCHAR(50) UNIQUE,
    telefone VARCHAR(20),
    data_nasc DATE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    excluido_em TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_usuario_criador FOREIGN KEY (fk_criador) REFERENCES usuarios(id)
);

-- 3. Especializações (Herança)
CREATE TABLE coordenadores (
    id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    departamento VARCHAR(50)
);

CREATE TABLE professores (
    id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    especialidade VARCHAR(50)
);

CREATE TABLE alunos (
    id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    matricula VARCHAR(50) UNIQUE NOT NULL
);

-- 4. Estrutura Acadêmica
CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    ano_letivo INT NOT NULL,
    status status_turma_enum DEFAULT 'ativa'
);

CREATE TABLE matriculas (
    id SERIAL PRIMARY KEY,
    fk_aluno INT REFERENCES alunos(id),
    fk_turma INT REFERENCES turmas(id),
    data_matricula DATE DEFAULT CURRENT_DATE,
    status_aluno status_aluno_enum DEFAULT 'matriculado'
);

CREATE TABLE disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INT
);

CREATE TABLE periodos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL
);

-- 5. Grade Escolar
CREATE TABLE grade_escolar (
    id SERIAL PRIMARY KEY,
    fk_professor INT REFERENCES professores(id),
    fk_disciplina INT REFERENCES disciplinas(id),
    fk_turma INT REFERENCES turmas(id)
);

-- 6. Registro de Notas
CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    fk_matricula INT REFERENCES matriculas(id),
    fk_grade_escolar INT REFERENCES grade_escolar(id),
    fk_periodo INT REFERENCES periodos(id),
    valor_nota DECIMAL(5,2) NOT NULL CHECK (valor_nota BETWEEN 0 AND 10),
    criado_por INT REFERENCES usuarios(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Registro de Frequência
CREATE TABLE frequencia (
    id SERIAL PRIMARY KEY,
    fk_matricula INT REFERENCES matriculas(id),
    fk_grade_escolar INT REFERENCES grade_escolar(id),
    data_aula DATE NOT NULL,
    presenca BOOLEAN DEFAULT TRUE
);

-- 8. Função e Trigger para atualizar o campo 'atualizado_em' automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_atualizado_em
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();