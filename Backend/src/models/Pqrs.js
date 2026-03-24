// Backend: models/pqrs.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pqrs = sequelize.define('Pqrs', {
  id_pqrs: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pqrs' // Especificar explícitamente el nombre de la columna
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre'
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'correo'
  },
  tipo_pqrs: {
    type: DataTypes.STRING(50), // Cambiado de ENUM a STRING temporalmente
    allowNull: false,
    field: 'tipo_pqrs'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descripcion'
  },
  estado: {
    type: DataTypes.STRING(50), // Cambiado de ENUM a STRING temporalmente
    defaultValue: 'Pendiente',
    allowNull: false,
    field: 'estado'
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
    field: 'respuesta'
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'fecha_solicitud'
  },
  fecha_respuesta: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_respuesta'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_usuario' // Especificar explícitamente
  }
}, {
  tableName: 'pqrs',
  timestamps: false,
  underscored: false, // Importante: no convertir a snake_case automáticamente
  freezeTableName: true // No pluralizar el nombre de la tabla
});

module.exports = Pqrs;