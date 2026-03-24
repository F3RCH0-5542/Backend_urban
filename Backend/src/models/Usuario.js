const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Rol = require("./Rol"); 



const Usuario = sequelize.define("Usuario", {
    id_usuario: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(45), 
        allowNull: false 
    },
    apellido: { 
        type: DataTypes.STRING(45), 
        allowNull: false 
    },
    documento: { 
        type: DataTypes.STRING(45), 
        allowNull: false 
    },
    correo: {
        type: DataTypes.STRING(45), 
        allowNull: false, 
        unique: true 
    },
    clave: {
        type: DataTypes.STRING(200), 
        allowNull: false 
    },
    usuario: { 
        type: DataTypes.STRING(45), 
        allowNull: true 
    },
    // 🔑 CORRECCIÓN FINAL: Usamos 'id_rol' porque es el nombre real de la columna en tu DB.
    id_rol: { 
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "usuarios", 
    timestamps: false,
});


module.exports = Usuario;