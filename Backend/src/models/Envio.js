const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Envio = sequelize.define("Envio", {
    id_envio: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // ✅ AGREGADO: ciudad de destino
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    // ✅ AGREGADO: teléfono de contacto
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    // ✅ AGREGADO: estado del envío
    estado_envio: {
        type: DataTypes.ENUM('pendiente', 'en_camino', 'entregado', 'devuelto'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "envio", 
    timestamps: false
});

module.exports = Envio;