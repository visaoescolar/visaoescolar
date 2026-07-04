const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Avaliacao = sequelize.define('avaliacao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING(150) },
  nota: { type: DataTypes.DECIMAL(5, 2) },
  data_avaliacao: { type: DataTypes.DATEONLY },
  id_matricula: { type: DataTypes.INTEGER },
  id_aula: { type: DataTypes.INTEGER }
});

module.exports = Avaliacao;