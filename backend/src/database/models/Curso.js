const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Curso = sequelize.define('curso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING(150), allowNull: false },
  sigla: { type: DataTypes.STRING(10) }
});

module.exports = Curso;