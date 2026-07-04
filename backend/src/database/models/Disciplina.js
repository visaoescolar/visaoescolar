const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Disciplina = sequelize.define('disciplina', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING(150), allowNull: false },
  codigo: { type: DataTypes.STRING(50), allowNull: true },
  carga_horaria: { type: DataTypes.INTEGER, allowNull: true },
  ementa: { type: DataTypes.TEXT, allowNull: true }
});

module.exports = Disciplina;