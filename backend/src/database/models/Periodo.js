const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Periodo = sequelize.define('periodo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING(100), allowNull: false }
});

module.exports = Periodo;