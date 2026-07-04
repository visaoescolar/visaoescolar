const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professor = sequelize.define('professor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  formacao: { type: DataTypes.STRING(150) },
  especializacao: { type: DataTypes.STRING(150) },
  data_admissao: { type: DataTypes.DATEONLY }
});

module.exports = Professor;