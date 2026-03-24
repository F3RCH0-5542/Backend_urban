const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Registro = sequelize.define("Registro", {
    id_registro: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
    type: DataTypes.STRING(255),  // Cambiar VARCHAR por STRING
    allowNull: false
},
contraseña: {
    type: DataTypes.STRING(100),  // Cambiar VARCHAR por STRING
    allowNull: false
},
rol: {
    type: DataTypes.STRING(100),  // Cambiar VARCHAR por STRING
    allowNull: false
}
}, {
    tableName: "registro", 
    timestamps: false
});

module.exports = Registro;