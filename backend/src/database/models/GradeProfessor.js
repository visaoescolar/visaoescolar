const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const GradeProfessor = sequelize.define('grade_professor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ano_letivo: { type: DataTypes.INTEGER }, // YEAR do MySQL mapeia-se geralmente como INTEGER no Sequelize
  qtd_aula: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING(20) },
  id_grade: { type: DataTypes.INTEGER },
  id_professor: { type: DataTypes.INTEGER }
});

module.exports = GradeProfessor;