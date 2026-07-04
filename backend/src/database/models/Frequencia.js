const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Frequencia = sequelize.define('frequencia', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presente: { type: DataTypes.TINYINT(1) },
  observacao: { type: DataTypes.STRING(255) },
  id_matricula: { type: DataTypes.INTEGER },
  id_aula: { type: DataTypes.INTEGER }
});

module.exports = Frequencia;