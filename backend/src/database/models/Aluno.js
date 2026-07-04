const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Aluno = sequelize.define('aluno', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  matricula: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  filiacao: { type: DataTypes.STRING(150) },
  data_ingresso: { type: DataTypes.DATEONLY },
  status_aluno: { type: DataTypes.STRING(50) }
});

module.exports = Aluno;