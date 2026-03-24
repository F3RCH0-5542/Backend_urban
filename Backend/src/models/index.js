const Usuario         = require("./Usuario");
const Rol             = require("./Rol");
const Producto        = require("./Producto");        // ✅ AGREGADO
const Inventario      = require("./inventario");
const Pedido          = require("./pedido");
const DetallePedido   = require("./DetallePedido");   // ✅ AGREGADO
const Personalizacion = require("./Personalizacion");
const Pago            = require("./Pago");
const Venta           = require("./Venta");
const Envio           = require("./Envio");
const Registro        = require("./Registro");
const Pqrs            = require("./Pqrs");

// ── Rol ↔ Usuario ────────────────────────────────────────────
Rol.hasMany(Usuario, { foreignKey: "id_rol" });
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });

// ── Usuario ↔ Pedido ─────────────────────────────────────────
Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });

// ── Pedido ↔ DetallePedido ───────────────────────────────────
Pedido.hasMany(DetallePedido, { foreignKey: "id_pedido", as: "detalles" });
DetallePedido.belongsTo(Pedido, { foreignKey: "id_pedido" });

// ── Producto ↔ DetallePedido ─────────────────────────────────
Producto.hasMany(DetallePedido, { foreignKey: "id_producto" });
DetallePedido.belongsTo(Producto, { foreignKey: "id_producto" });

// ── Pedido ↔ Personalizacion ─────────────────────────────────
Pedido.hasMany(Personalizacion, { foreignKey: "id_pedido" });
Personalizacion.belongsTo(Pedido, { foreignKey: "id_pedido" });

// ── Producto ↔ Personalizacion ───────────────────────────────
Producto.hasMany(Personalizacion, { foreignKey: "id_producto" });
Personalizacion.belongsTo(Producto, { foreignKey: "id_producto" });  // ✅ AGREGADO

// ── DetallePedido ↔ Personalizacion ─────────────────────────
Personalizacion.hasMany(DetallePedido, { foreignKey: "id_personalizacion" });
DetallePedido.belongsTo(Personalizacion, { foreignKey: "id_personalizacion" });

// ── Producto ↔ Inventario ────────────────────────────────────
Producto.hasOne(Inventario, { foreignKey: "id_producto" });           // ✅ CORREGIDO (era hasMany)
Inventario.belongsTo(Producto, { foreignKey: "id_producto" });

// ── Pedido ↔ Pago ────────────────────────────────────────────
Pedido.hasOne(Pago, { foreignKey: "id_pedido" });
Pago.belongsTo(Pedido, { foreignKey: "id_pedido" });

// ── Pedido ↔ Venta ───────────────────────────────────────────
Pedido.hasOne(Venta, { foreignKey: "id_pedido" });
Venta.belongsTo(Pedido, { foreignKey: "id_pedido" });

// ── Usuario ↔ Venta ──────────────────────────────────────────
Usuario.hasMany(Venta, { foreignKey: "id_usuario" });
Venta.belongsTo(Usuario, { foreignKey: "id_usuario" });

// ── Pedido ↔ Envio ───────────────────────────────────────────
Pedido.hasOne(Envio, { foreignKey: "id_pedido" });
Envio.belongsTo(Pedido, { foreignKey: "id_pedido" });

// ── Usuario ↔ Registro ───────────────────────────────────────
Usuario.hasMany(Registro, { foreignKey: "id_usuario" });
Registro.belongsTo(Usuario, { foreignKey: "id_usuario" });

// ── Usuario ↔ Pqrs ───────────────────────────────────────────
Usuario.hasMany(Pqrs, { foreignKey: "id_usuario" });
Pqrs.belongsTo(Usuario, { foreignKey: "id_usuario" });

module.exports = {
    Usuario,
    Rol,
    Producto,        // ✅
    Inventario,
    Pedido,
    DetallePedido,   // ✅
    Personalizacion,
    Pago,
    Venta,
    Envio,
    Registro,
    Pqrs
};