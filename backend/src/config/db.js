const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sistema_escolar_v2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('MySQL pool conectado com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
  }
})();

module.exports = pool;
