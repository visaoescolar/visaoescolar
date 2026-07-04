/**
 * Script de setup automático: descobre a senha do MySQL local (testando uma lista
 * de senhas comuns, já que em algumas máquinas o root não tem senha conhecida),
 * garante que o banco de dados exista e só então sobe o backend normalmente.
 *
 * No Ubuntu, o root do MySQL costuma vir configurado com o plugin "auth_socket":
 * nesse modo NENHUMA senha funciona por login normal (TCP), só "sudo mysql" entra
 * (porque a autenticação é feita pelo usuário do sistema operacional, não por senha).
 * É exatamente por isso que ninguém "sabe" a senha — ela nunca existiu. Quando a
 * descoberta de senha falhar e o script estiver rodando em Linux, ele usa
 * "sudo mysql" para trocar o root para autenticação por senha (mysql_native_password)
 * com uma senha conhecida, e segue o setup normalmente.
 *
 * Uso: npm run setup   (dentro de backend/)
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');

const ENV_PATH = path.join(__dirname, '..', '.env');

const HOST = process.env.DB_HOST || 'localhost';
const PORT = Number(process.env.DB_PORT) || 3306;
const USER = process.env.DB_USER || 'root';
const DB_NAME = process.env.DB_NAME || 'visaoescolar';

// Senha que passa a valer para o root caso seja preciso resetar (só acontece se
// nenhuma senha candidata funcionar e o script estiver rodando em Linux).
const SENHA_RESET = process.env.DB_RESET_PASSWORD || 'ceep';

// Tenta primeiro a senha já configurada no .env (se houver), depois uma lista de
// senhas padrão comuns em instalações locais de MySQL/XAMPP/WAMP.
const SENHAS_CANDIDATAS = [
  process.env.DB_PASS,
  '',
  'root',
  'mysql',
  'admin',
  'senha',
  'password',
  '123456',
  '12345678',
  '1234',
  'toor',
  'ceep'
].filter((senha, indice, lista) => senha !== undefined && lista.indexOf(senha) === indice);

async function descobrirSenha() {
  for (const senha of SENHAS_CANDIDATAS) {
    try {
      console.log(`  testando senha "${senha}"...`);
      const conexao = await mysql.createConnection({ host: HOST, port: PORT, user: USER, password: senha });
      await conexao.end();
      return senha;
    } catch (erro) {
      if (erro.code !== 'ER_ACCESS_DENIED_ERROR') {
        // Erro de conexão (MySQL não está rodando, host/porta errados, etc.) — não
        // adianta continuar tentando senhas, o problema não é de autenticação.
        throw erro;
      }
    }
  }
  return null;
}

function atualizarEnvComSenha(senha) {
  const conteudoAtual = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const linhas = conteudoAtual.length > 0 ? conteudoAtual.split(/\r?\n/) : [];

  let achouLinha = false;
  const novasLinhas = linhas.map((linha) => {
    if (linha.startsWith('DB_PASS=')) {
      achouLinha = true;
      return `DB_PASS=${senha}`;
    }
    return linha;
  });
  if (!achouLinha) novasLinhas.push(`DB_PASS=${senha}`);

  fs.writeFileSync(ENV_PATH, novasLinhas.join('\n'));
}

// Tenta resetar a senha do root via "sudo mysql" (só funciona em Linux com sudo
// disponível, e quando o usuário do SO tem permissão de sudo). Testa a sintaxe do
// MySQL 8, depois a da MariaDB, depois a sintaxe legada, já que não dá pra saber
// de antemão qual servidor está instalado na máquina.
function resetarSenhaRootViaSudo(novaSenha) {
  const tentativas = [
    `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${novaSenha}'; FLUSH PRIVILEGES;`,
    `ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('${novaSenha}'); FLUSH PRIVILEGES;`,
    `SET PASSWORD FOR 'root'@'localhost' = PASSWORD('${novaSenha}'); FLUSH PRIVILEGES;`
  ];

  for (const sql of tentativas) {
    try {
      execSync(`sudo mysql -e "${sql}"`, { stdio: 'inherit' });
      return true;
    } catch (erro) {
      // tenta a próxima sintaxe
    }
  }
  return false;
}

async function garantirBancoExiste(senha) {
  const conexao = await mysql.createConnection({ host: HOST, port: PORT, user: USER, password: senha });
  await conexao.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await conexao.end();
}

(async () => {
  console.log(`🔍 Procurando a senha do MySQL em ${HOST}:${PORT} (usuário "${USER}")...`);

  let senha;
  try {
    senha = await descobrirSenha();
  } catch (erro) {
    console.error(`\n❌ Não foi possível conectar ao MySQL em ${HOST}:${PORT}.`);
    console.error('   Verifique se o serviço do MySQL está rodando nesta máquina.');
    console.error(`   Detalhes: ${erro.code || ''} ${erro.message}`);
    process.exit(1);
  }

  if (senha === null && process.platform === 'linux') {
    console.log('\n⚠️  Nenhuma senha comum funcionou. No Ubuntu isso geralmente é porque o root');
    console.log('   do MySQL usa autenticação "auth_socket" — sem senha de verdade, só "sudo mysql" entra.');
    console.log(`   Resetando a senha do root para uma senha conhecida via "sudo mysql" (pode pedir sua senha de sudo)...`);

    const resetou = resetarSenhaRootViaSudo(SENHA_RESET);
    if (!resetou) {
      console.error('\n❌ Não foi possível resetar a senha via "sudo mysql".');
      console.error('   Verifique se o MySQL está instalado e se o seu usuário tem permissão de sudo,');
      console.error('   ou rode manualmente: sudo mysql -e "ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'suasenha\'; FLUSH PRIVILEGES;"');
      process.exit(1);
    }

    senha = SENHA_RESET;
    console.log('✅ Senha do root resetada com sucesso.');
  }

  if (senha === null) {
    console.error('\n❌ Nenhuma das senhas comuns funcionou para o usuário root.');
    console.error('   Edite DB_PASS em backend/.env manualmente com a senha correta do MySQL desta máquina e rode novamente.');
    console.error(`   Senhas testadas: ${SENHAS_CANDIDATAS.map(s => `"${s}"`).join(', ')}`);
    process.exit(1);
  }

  console.log(senha === '' ? '✅ MySQL local sem senha (root sem senha).' : '✅ Senha do MySQL pronta para uso.');
  atualizarEnvComSenha(senha);
  process.env.DB_PASS = senha; // garante que o server.js, ao subir em seguida, use a senha certa

  console.log(`🏗️  Garantindo que o banco "${DB_NAME}" existe...`);
  try {
    await garantirBancoExiste(senha);
  } catch (erro) {
    console.error(`\n❌ Conectou ao MySQL, mas não conseguiu criar/verificar o banco "${DB_NAME}".`);
    console.error(`   Detalhes: ${erro.code || ''} ${erro.message}`);
    process.exit(1);
  }

  console.log('🚀 Subindo o backend...\n');
  require('../src/server.js');
})();
