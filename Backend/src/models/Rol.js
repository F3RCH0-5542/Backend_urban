const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rol = sequelize.define("Rol", {
    id_rol: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre_rol: { 
        type: DataTypes.STRING(45), 
        allowNull: false 
    },
    descripcion: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    }
}, {
    tableName: "rol", 
    timestamps: false
});

module.exports = Rol;