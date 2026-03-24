// models/Personalizacion.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Personalizacion = sequelize.define("Personalizacion", {
    id_personalizacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // ✅ NUEVO: producto base que el usuario quiere personalizar
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    descripcion_personalizacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tipo_personalizacion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    imagen_referencia: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // ✅ NUEVO: color que el usuario desea
    color_deseado: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    // ✅ NUEVO: talla deseada
    talla: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'aprobada', 'rechazada'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    precio_adicional: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: "personalizacion",
    timestamps: false
});

module.exports = Personalizacion;