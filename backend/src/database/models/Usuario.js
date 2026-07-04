const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  senha: { type: DataTypes.STRING(255), allowNull: false },
  status: { type: DataTypes.TINYINT(1), defaultValue: 1 },
  tipo: { type: DataTypes.STRING(50), allowNull: true }
});

module.exports = Usuario;