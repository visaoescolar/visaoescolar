const sequelize = require('./database');

// Importação de todos os Modelos
const Pessoa = require('./models/Pessoa');
const Usuario = require('./models/Usuario');
const Aluno = require('./models/Aluno');
const Professor = require('./models/Professor');
const Coordenador = require('./models/Coordenador');
const Secretario = require('./models/Secretario');
const Curso = require('./models/Curso');
const Semestre = require('./models/Semestre');
const Turma = require('./models/Turma');
const Disciplina = require('./models/Disciplina');
const Periodo = require('./models/Periodo');
const Grade = require('./models/Grade');
const Matricula = require('./models/Matricula');
const GradeProfessor = require('./models/GradeProfessor');
const Aula = require('./models/Aula');
const Avaliacao = require('./models/Avaliacao');
const Frequencia = require('./models/Frequencia');
const Horario = require('./models/Horario');

// ==========================================
//    DEFINIÇÃO DE RELACIONAMENTOS (DER)
// ==========================================

// 1. Relacionamento Pessoa -> Outros papéis (1:N ou 1:1 estendido no seu DER)
Usuario.hasMany(Pessoa, { foreignKey: 'id_usuario', as: 'pessoas' });
Pessoa.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Pessoa.hasMany(Aluno, { foreignKey: 'id_pessoa', as: 'alunos' });
Aluno.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });

Pessoa.hasMany(Professor, { foreignKey: 'id_pessoa', as: 'professores' });
Professor.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });

Pessoa.hasMany(Coordenador, { foreignKey: 'id_pessoa', as: 'coordenadores' });
Coordenador.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });

Pessoa.hasMany(Secretario, { foreignKey: 'id_pessoa', as: 'secretarios' });
Secretario.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });

// 2. Relacionamento Curso & Coordenador
Curso.hasMany(Coordenador, { foreignKey: 'id_curso', as: 'coordenadores' });
Coordenador.belongsTo(Curso, { foreignKey: 'id_curso', as: 'curso' });

// Relacionamento Curso & Disciplina
Curso.hasMany(Disciplina, { foreignKey: 'curso_id', as: 'disciplinas' });
Disciplina.belongsTo(Curso, { foreignKey: 'curso_id', as: 'curso' });

// 3. Composição da Tabela GRADE (Chaves que formam as dependências da Grade)
Turma.hasMany(Grade, { foreignKey: 'id_turma', as: 'grades' });
Grade.belongsTo(Turma, { foreignKey: 'id_turma' });

Disciplina.hasMany(Grade, { foreignKey: 'id_disciplina', as: 'grades' });
Grade.belongsTo(Disciplina, { foreignKey: 'id_disciplina' });

Semestre.hasMany(Grade, { foreignKey: 'id_semestre', as: 'grades' });
Grade.belongsTo(Semestre, { foreignKey: 'id_semestre' });

Curso.hasMany(Grade, { foreignKey: 'id_curso', as: 'grades' });
Grade.belongsTo(Curso, { foreignKey: 'id_curso' });

Periodo.hasMany(Grade, { foreignKey: 'id_periodo', as: 'grades' });
Grade.belongsTo(Periodo, { foreignKey: 'id_periodo' });

// 4. Relacionamentos da MATRÍCULA
Aluno.hasMany(Matricula, { foreignKey: 'id_aluno', as: 'matriculas' });
Matricula.belongsTo(Aluno, { foreignKey: 'id_aluno' });

Grade.hasMany(Matricula, { foreignKey: 'id_grade', as: 'matriculas' });
Matricula.belongsTo(Grade, { foreignKey: 'id_grade' });

// 5. Relacionamentos da GRADE_PROFESSOR
Grade.hasMany(GradeProfessor, { foreignKey: 'id_grade', as: 'grade_professores' });
GradeProfessor.belongsTo(Grade, { foreignKey: 'id_grade' });

Professor.hasMany(GradeProfessor, { foreignKey: 'id_professor', as: 'grade_professores' });
GradeProfessor.belongsTo(Professor, { foreignKey: 'id_professor' });

// 6. Relacionamentos da AULA
GradeProfessor.hasMany(Aula, { foreignKey: 'id_grade_professor', as: 'aulas' });
Aula.belongsTo(GradeProfessor, { foreignKey: 'id_grade_professor' });

// 7. Relacionamentos da AVALIAÇÃO
Matricula.hasMany(Avaliacao, { foreignKey: 'id_matricula', as: 'avaliacoes' });
Avaliacao.belongsTo(Matricula, { foreignKey: 'id_matricula' });

Aula.hasMany(Avaliacao, { foreignKey: 'id_aula', as: 'avaliacoes' });
Avaliacao.belongsTo(Aula, { foreignKey: 'id_aula' });

// 8. Relacionamentos da FREQUENCIA
Aula.hasMany(Frequencia, { foreignKey: 'id_aula', as: 'frequencias' });
Frequencia.belongsTo(Aula, { foreignKey: 'id_aula' });

Matricula.hasMany(Frequencia, { foreignKey: 'id_matricula', as: 'frequencias' });
Frequencia.belongsTo(Matricula, { foreignKey: 'id_matricula' });

// 9. Relacionamentos do HORÁRIO
GradeProfessor.hasMany(Horario, { foreignKey: 'id_grade_professor', as: 'horarios' });
Horario.belongsTo(GradeProfessor, { foreignKey: 'id_grade_professor' });


// ==========================================
//  EXECUÇÃO E CONEXÃO COM O BANCO DE DADOS
// ==========================================
async function rodarBanco() {
  try {
    // Autentica as credenciais
    await sequelize.authenticate();
    console.log('🚀 Conexão com o MySQL bem-sucedida!');

    // Sincroniza as tabelas com a estrutura descrita acima
    // O modificador { alter: true } atualiza a estrutura mantendo dados existentes locais
    await sequelize.sync({ alter: true });
    console.log('🏢 Todas as 15 tabelas e chaves estrangeiras foram criadas/sincronizadas.');
    
  } catch (error) {
    console.error('❌ Ocorreu um erro ao conectar ou estruturar o banco:', error);
  }
}

rodarBanco();