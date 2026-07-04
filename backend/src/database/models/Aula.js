const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Aula = sequelize.define('aula', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  data_aula: { type: DataTypes.DATEONLY },
  conteudo: { type: DataTypes.TEXT },
  tipo: { type: DataTypes.STRING(20), defaultValue: 'avaliacao' },
  id_grade_professor: { type: DataTypes.INTEGER }
});

module.exports = Aula;