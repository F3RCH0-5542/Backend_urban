const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pedido = sequelize.define("Pedido", {
    id_pedido: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // ✅ NUEVO: estado del pedido
    estado: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'enviado', 'completado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    // ✅ NUEVO: método de pago asociado al pedido
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: "pedido", 
    timestamps: false
});

module.exports = Pedido;