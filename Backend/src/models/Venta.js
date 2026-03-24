const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venta = sequelize.define("Venta", {
    id_venta: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    // ✅ NUEVO: vincula la venta con un pedido
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // ✅ NUEVO: total de la venta
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    // ✅ NUEVO: estado de la venta
    estado: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada', 'reembolsada'),
        allowNull: false,
        defaultValue: 'pendiente'
    }
}, {
    tableName: "ventas", 
    timestamps: false
});

module.exports = Venta;