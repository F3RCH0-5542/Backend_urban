// src/models/Producto.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
    "Producto",
    {
        id_producto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_producto: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        precio_base: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING(50)
        },
        stock_disponible: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        imagen: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "productos",
        timestamps: false
    }
);

module.exports = Producto;