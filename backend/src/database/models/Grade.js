const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Grade = sequelize.define('grade', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  carga_horaria: { type: DataTypes.INTEGER },
  id_turma: { type: DataTypes.INTEGER },
  id_disciplina: { type: DataTypes.INTEGER },
  id_semestre: { type: DataTypes.INTEGER },
  id_curso: { type: DataTypes.INTEGER },
  id_periodo: { type: DataTypes.INTEGER }
});

module.exports = Grade;