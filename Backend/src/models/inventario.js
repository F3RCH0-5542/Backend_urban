// models/Inventario.js
// REDISEÑADO: El inventario ahora rastrea movimientos por producto
// El stock real = suma de todas las entradas - suma de todas las salidas

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inventario = sequelize.define("Inventario", {
    id_inventario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "productos",
            key: "id_producto"
        }
    },
    tipo: {
        // 'entrada'  → reposición de stock (compra a proveedor, ajuste manual positivo)
        // 'salida'   → venta, merma, ajuste manual negativo
        // 'ajuste'   → corrección directa del stock (inventario físico)
        type: DataTypes.ENUM("entrada", "salida", "ajuste"),
        allowNull: false
    },
    cantidad: {
        // Siempre positivo. El tipo determina si suma o resta.
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    stock_resultante: {
        // Stock del producto DESPUÉS de aplicar este movimiento
        // Guardarlo aquí evita recalcular toda la historia cada vez
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    stock_minimo: {
        // Umbral de alerta. Si stock_resultante <= stock_minimo → alerta
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    motivo: {
        // Descripción opcional del movimiento
        // Ej: "Venta pedido #45", "Reposición proveedor", "Ajuste inventario físico"
        type: DataTypes.STRING(255),
        allowNull: true
    },
    id_referencia: {
        // ID del pedido o documento que originó el movimiento (opcional)
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha_movimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "inventario",
    timestamps: false
});

module.exports = Inventario;