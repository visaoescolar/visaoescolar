const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Coordenador = sequelize.define('coordenador', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulacao: { type: DataTypes.STRING(100) },
  data_inicio: { type: DataTypes.DATEONLY }
});

module.exports = Coordenador;