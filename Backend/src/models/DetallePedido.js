const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetallePedido = sequelize.define(
    "DetallePedido",
    {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_pedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "pedido", key: "id_pedido" }
        },
        id_producto: {
            type: DataTypes.INTEGER,
            allowNull: true,  // nullable por si el producto fue eliminado
            references: { model: "productos", key: "id_producto" }
        },
        // ✅ AGREGADO: nombre del producto al momento de la compra
        nombre_producto: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        // ✅ AGREGADO: imagen del producto al momento de la compra
        imagen: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        // ✅ AGREGADO: personalización opcional asociada al detalle
        id_personalizacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "personalizacion", key: "id_personalizacion" }
        }
    },
    {
        tableName: "detalle_pedido",
        timestamps: false
    }
);

module.exports = DetallePedido;