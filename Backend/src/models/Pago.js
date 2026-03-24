const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pago = sequelize.define("Pago", {
    id_pago: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    // ✅ NUEVO: estado del pago
    estado_pago: {
        type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    // ✅ NUEVO: referencia externa (código de transacción, etc.)
    referencia: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: "pago", 
    timestamps: false
});

module.exports = Pago;