/**
 * Script de seed: cria 10 turmas de "1º Ano" (A a J), todas com o mesmo professor
 * e vinculadas ao mesmo pedagogo (coordenador), cada turma com 20 alunos, notas e
 * frequência lançadas em 4 bimestres, e um horário de aula fixo (dia da semana +
 * hora de início) para que a Grade Horária do coordenador também tenha dados reais.
 *
 * Pré-requisito: rode o backend pelo menos uma vez antes (npm run dev) para que
 * o schema do banco já tenha sido sincronizado.
 *
 * Uso: node src/database/seed.js   (ou: npm run seed, dentro de backend/)
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');

const sequelize = require('./database');

const Curso = require('./models/Curso');
const Disciplina = require('./models/Disciplina');
const Semestre = require('./models/Semestre');
const Periodo = require('./models/Periodo');
const Turma = require('./models/Turma');
const Usuario = require('./models/Usuario');
const Pessoa = require('./models/Pessoa');
const Professor = require('./models/Professor');
const Coordenador = require('./models/Coordenador');
const Aluno = require('./models/Aluno');
const Grade = require('./models/Grade');
const GradeProfessor = require('./models/GradeProfessor');
const Aula = require('./models/Aula');
const Horario = require('./models/Horario');
const Matricula = require('./models/Matricula');
const Avaliacao = require('./models/Avaliacao');
const Frequencia = require('./models/Frequencia');

// Registra apenas as associações necessárias para que os FKs abaixo sejam
// reconhecidos como atributos do modelo (ex: Aluno.id_pessoa, Disciplina.curso_id).
// Não requeremos ./index.js de propósito: ele dispara um sequelize.sync({alter:true})
// em segundo plano que pode entrar em conflito com os inserts deste script.
// O schema já deve existir (rode o backend ao menos uma vez antes deste seed).
Pessoa.hasMany(Aluno, { foreignKey: 'id_pessoa', as: 'alunos' });
Aluno.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });
Pessoa.hasMany(Professor, { foreignKey: 'id_pessoa', as: 'professores' });
Professor.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });
Pessoa.hasMany(Coordenador, { foreignKey: 'id_pessoa', as: 'coordenadores' });
Coordenador.belongsTo(Pessoa, { foreignKey: 'id_pessoa', as: 'pessoa' });
Curso.hasMany(Coordenador, { foreignKey: 'id_curso', as: 'coordenadores' });
Coordenador.belongsTo(Curso, { foreignKey: 'id_curso', as: 'curso' });
Curso.hasMany(Disciplina, { foreignKey: 'curso_id', as: 'disciplinas' });
Disciplina.belongsTo(Curso, { foreignKey: 'curso_id', as: 'curso' });

const ANO_LETIVO = new Date().getFullYear();
const CPF_BASE = 90000000000; // faixa reservada para dados de seed, evita colisão com CPFs reais
const CPF_OFFSET_PROFESSOR = 0;
const CPF_OFFSET_PEDAGOGO = 1;
const CPF_OFFSET_ALUNOS_INICIO = 100; // alunos usam offsets 101..300 (10 turmas x 20), longe do professor/pedagogo

const LETRAS_TURMA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ALUNOS_POR_TURMA = 20;

const DIAS_SEMANA_NOMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// Um horário fixo por turma (dia da semana + hora de início), distribuído de
// Segunda a Sexta em 2 horários por dia, para que o mesmo professor nunca tenha
// duas turmas no mesmo dia/hora.
const HORARIOS_POR_TURMA = [
  { dia: 1, hora: '07:00' }, { dia: 1, hora: '08:50' },
  { dia: 2, hora: '07:00' }, { dia: 2, hora: '08:50' },
  { dia: 3, hora: '07:00' }, { dia: 3, hora: '08:50' },
  { dia: 4, hora: '07:00' }, { dia: 4, hora: '08:50' },
  { dia: 5, hora: '07:00' }, { dia: 5, hora: '08:50' }
];

const PRIMEIRO_NOME = [
  'Ana', 'Bruno', 'Carla', 'Daniel', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique',
  'Isabela', 'João', 'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Olívia', 'Pedro',
  'Raquel', 'Samuel', 'Tatiane', 'Vinícius', 'Yasmin', 'Caio', 'Beatriz', 'Diego',
  'Elaine', 'Fábio', 'Giovanna', 'Hugo', 'Ingrid', 'Júlio', 'Larissa', 'Marcelo',
  'Natália', 'Otávio', 'Paula', 'Rafael', 'Sabrina', 'Thiago', 'Valentina', 'William'
];
const SOBRENOME = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Almeida', 'Lima',
  'Carvalho', 'Gomes', 'Ribeiro', 'Martins', 'Rocha', 'Barbosa', 'Teixeira'
];

function gerarNome(indice) {
  return `${PRIMEIRO_NOME[indice % PRIMEIRO_NOME.length]} ${SOBRENOME[indice % SOBRENOME.length]}`;
}

function gerarCPF(offset) {
  return String(CPF_BASE + offset);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function notaAleatoria() {
  return Number((Math.random() * 7 + 3).toFixed(1)); // entre 3.0 e 10.0
}

function frequenciaAleatoria() {
  return Math.round(Math.random() * 40 + 60); // entre 60% e 100%
}

async function seedTurma({ turmaLabel, letra, gradeId, aulas, offsetInicial }) {
  console.log(`\n--- Populando ${turmaLabel} (${ALUNOS_POR_TURMA} alunos) ---`);

  for (let i = 1; i <= ALUNOS_POR_TURMA; i++) {
    const offsetGlobal = offsetInicial + i; // identificador único entre todas as turmas
    const nome = gerarNome(offsetGlobal - 1);
    const login = `aluno.${letra.toLowerCase()}${pad2(i)}@escola.com`;
    const cpf = gerarCPF(offsetGlobal);
    const matricula = `${ANO_LETIVO}${letra}${pad2(i)}`;

    const [usuarioAluno] = await Usuario.findOrCreate({
      where: { login },
      defaults: { senha: '123456', status: 1, tipo: 'aluno' }
    });

    const [pessoaAluno] = await Pessoa.findOrCreate({
      where: { cpf },
      defaults: {
        nome,
        data_nascimento: '2010-03-15',
        telefone: '',
        endereco: '',
        status: 1,
        id_usuario: usuarioAluno.id
      }
    });

    const [aluno] = await Aluno.findOrCreate({
      where: { matricula },
      defaults: {
        id_pessoa: pessoaAluno.id,
        filiacao: '',
        data_ingresso: new Date(),
        status_aluno: 'Ativo'
      }
    });

    const [matriculaTurma] = await Matricula.findOrCreate({
      where: { id_aluno: aluno.id, id_grade: gradeId },
      defaults: { data_matricula: new Date(), status: 'Ativa' }
    });

    for (const aula of aulas) {
      const nota = notaAleatoria();
      const freq = frequenciaAleatoria();

      await Avaliacao.findOrCreate({
        where: { id_matricula: matriculaTurma.id, id_aula: aula.id },
        defaults: { descricao: aula.conteudo, nota, data_avaliacao: aula.data_aula }
      });

      await Frequencia.findOrCreate({
        where: { id_matricula: matriculaTurma.id, id_aula: aula.id },
        defaults: { presente: freq >= 75 ? 1 : 0, observacao: String(freq) }
      });
    }

    process.stdout.write(`  [${pad2(i)}/${ALUNOS_POR_TURMA}] ${nome} (matrícula ${matricula})\r`);
  }
  console.log(`\n${turmaLabel} populada com sucesso.`);
}

async function main() {
  await sequelize.authenticate();
  console.log('Conectado ao banco. Iniciando seed...');

  // 1. Estrutura acadêmica básica
  const [curso] = await Curso.findOrCreate({
    where: { descricao: 'Ensino Médio' },
    defaults: { sigla: 'EM' }
  });

  const [disciplina] = await Disciplina.findOrCreate({
    where: { descricao: 'Matemática', curso_id: curso.id },
    defaults: { codigo: 'MAT100', carga_horaria: 80, ementa: '' }
  });

  const [semestre] = await Semestre.findOrCreate({
    where: { descricao: `1º Semestre ${ANO_LETIVO}` }
  });

  const [periodo] = await Periodo.findOrCreate({
    where: { descricao: 'Matutino' }
  });

  // 2. Professor (o mesmo para as 10 turmas)
  const senhaProfessorHash = await bcrypt.hash('senha123', await bcrypt.genSalt(10));
  const [usuarioProf] = await Usuario.findOrCreate({
    where: { login: 'prof.dezturmas@escola.com' },
    defaults: { senha: senhaProfessorHash, status: 1, tipo: 'professor' }
  });

  const [pessoaProf] = await Pessoa.findOrCreate({
    where: { cpf: gerarCPF(CPF_OFFSET_PROFESSOR) },
    defaults: {
      nome: 'Professor(a) Seed',
      data_nascimento: '1985-01-01',
      telefone: '',
      endereco: '',
      status: 1,
      id_usuario: usuarioProf.id
    }
  });

  const [professor] = await Professor.findOrCreate({
    where: { id_pessoa: pessoaProf.id },
    defaults: { formacao: 'Licenciatura em Matemática', especializacao: 'Docência', data_admissao: new Date() }
  });

  // 3. Pedagogo (coordenador) vinculado ao curso, com visão de todas as turmas
  const senhaPedagogoHash = await bcrypt.hash('senha123', await bcrypt.genSalt(10));
  const [usuarioPedagogo] = await Usuario.findOrCreate({
    where: { login: 'pedagogo.dezturmas@escola.com' },
    defaults: { senha: senhaPedagogoHash, status: 1, tipo: 'coordenador' }
  });

  const [pessoaPedagogo] = await Pessoa.findOrCreate({
    where: { cpf: gerarCPF(CPF_OFFSET_PEDAGOGO) },
    defaults: {
      nome: 'Pedagogo(a) Seed',
      data_nascimento: '1980-01-01',
      telefone: '',
      endereco: '',
      status: 1,
      id_usuario: usuarioPedagogo.id
    }
  });

  await Coordenador.findOrCreate({
    where: { id_pessoa: pessoaPedagogo.id },
    defaults: { id_curso: curso.id, titulacao: 'Pedagogo(a)', data_inicio: new Date() }
  });

  // 4. Aulas de cada bimestre, reaproveitadas para cada turma
  const datasBimestre = ['03-15', '06-15', '09-15', '12-01'];
  async function criarAulas(gradeProfessor) {
    const aulas = [];
    for (let b = 1; b <= 4; b++) {
      const [aula] = await Aula.findOrCreate({
        where: { id_grade_professor: gradeProfessor.id, conteudo: `${b}º Bimestre` },
        defaults: { data_aula: `${ANO_LETIVO}-${datasBimestre[b - 1]}` }
      });
      aulas.push(aula);
    }
    return aulas;
  }

  // 5. Uma turma por letra (A a J): grade, vínculo do professor, horário de aula
  //    e os 20 alunos com notas/frequência.
  const resumoTurmas = [];

  for (let i = 0; i < LETRAS_TURMA.length; i++) {
    const letra = LETRAS_TURMA[i];
    const turmaLabel = `1º Ano ${letra}`;

    const [turma] = await Turma.findOrCreate({ where: { descricao: turmaLabel } });

    const [grade] = await Grade.findOrCreate({
      where: { id_curso: curso.id, id_turma: turma.id, id_disciplina: disciplina.id, id_semestre: semestre.id, id_periodo: periodo.id },
      defaults: { carga_horaria: 80 }
    });

    const [gradeProfessor] = await GradeProfessor.findOrCreate({
      where: { id_grade: grade.id, id_professor: professor.id },
      defaults: { ano_letivo: ANO_LETIVO, qtd_aula: 4, status: 'Ativo' }
    });

    const horarioConfig = HORARIOS_POR_TURMA[i];
    await Horario.findOrCreate({
      where: { id_grade_professor: gradeProfessor.id },
      defaults: { dia_semana: horarioConfig.dia, hora_inicio: horarioConfig.hora }
    });

    const aulas = await criarAulas(gradeProfessor);

    await seedTurma({
      turmaLabel,
      letra,
      gradeId: grade.id,
      aulas,
      offsetInicial: CPF_OFFSET_ALUNOS_INICIO + i * ALUNOS_POR_TURMA
    });

    resumoTurmas.push({ turmaLabel, dia: DIAS_SEMANA_NOMES[horarioConfig.dia], hora: horarioConfig.hora });
  }

  console.log('\n=========================================');
  console.log('Seed concluído com sucesso!');
  console.log('=========================================');
  console.log(`${LETRAS_TURMA.length} turmas de "1º Ano" (A a J), ${disciplina.descricao}, ${LETRAS_TURMA.length * ALUNOS_POR_TURMA} alunos no total.`);
  console.log('\nProfessor (vinculado às 10 turmas):');
  console.log('  login: prof.dezturmas@escola.com');
  console.log('  senha: senha123');
  console.log('\nPedagogo(a) / Coordenador(a) (vê todas as turmas do curso):');
  console.log('  login: pedagogo.dezturmas@escola.com');
  console.log('  senha: senha123');
  console.log('\nHorário de aula por turma:');
  for (const t of resumoTurmas) {
    console.log(`  ${t.turmaLabel.padEnd(12)} ${t.dia.padEnd(14)} ${t.hora}`);
  }
  console.log('\nFaça login como pedagogo(a)/coordenador(a) para ver os números no Dashboard e em Gestão Acadêmica.');
  console.log('=========================================\n');

  process.exit(0);
}

main().catch((error) => {
  console.error('Erro ao popular o banco:', error);
  process.exit(1);
});
