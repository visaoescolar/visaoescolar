const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Horario = sequelize.define('horario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dia_semana: { type: DataTypes.INTEGER }, // 0=Domingo .. 6=Sábado
  hora_inicio: { type: DataTypes.STRING(5) }, // "HH:MM"
  id_grade_professor: { type: DataTypes.INTEGER }
});

module.exports = Horario;
