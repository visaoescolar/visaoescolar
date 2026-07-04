const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Corresponde à tabela "secreta..." do diagrama
const Secretario = sequelize.define('secretario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

module.exports = Secretario;