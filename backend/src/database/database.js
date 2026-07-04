const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'visaoescolar',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'ceep',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Altere para console.log se quiser ver o SQL gerado no terminal
    define: {
      timestamps: false,     // O diagrama não possui colunas automáticas de timestamp
      freezeTableName: true  // Garante que o nome da tabela no MySQL seja exatamente igual ao do modelo
    }
  }
);

module.exports = sequelize;