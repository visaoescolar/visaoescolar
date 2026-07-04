const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pessoa = sequelize.define('pessoa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(150), allowNull: false },
  cpf: { type: DataTypes.STRING(14), allowNull: false, unique: true },
  data_nascimento: { type: DataTypes.DATEONLY },
  telefone: { type: DataTypes.STRING(20) },
  endereco: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.TINYINT(1), defaultValue: 1 },
  cadastrado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  alterado_em: { type: DataTypes.DATE },
  id_usuario: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = Pessoa;