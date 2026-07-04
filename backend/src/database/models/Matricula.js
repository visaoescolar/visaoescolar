const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Matricula = sequelize.define('matricula', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  data_matricula: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.STRING(50) },
  id_aluno: { type: DataTypes.INTEGER },
  id_grade: { type: DataTypes.INTEGER }
});

module.exports = Matricula;