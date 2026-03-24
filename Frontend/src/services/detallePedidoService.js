import api from "./api";

const BASE_URL = "/detalle-pedidos";

/**
 * Obtener lista completa de detalles de pedidos
 */
export const listDetallesPedidos = async () => {
  try {
    const res = await api.get(BASE_URL);
    return res.data;
  } catch (error) {
    console.error("Error al listar detalles de pedidos:", error);
    throw error.response?.data || { msg: "Error al listar detalles de pedidos" };
  }
};

/**
 * Obtener un detalle de pedido por ID
 * @param {number} id - ID del detalle
 */
export const getDetallePedidoById = async (id) => {
  try {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener detalle por ID:", error);
    throw error.response?.data || { msg: "Error al obtener detalle" };
  }
};

/**
 * Obtener todos los detalles de un pedido específico
 * @param {number} id_pedido - ID del pedido
 */
export const getDetallesByPedido = async (id_pedido) => {
  try {
    const res = await api.get(`${BASE_URL}/pedido/${id_pedido}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener detalles del pedido:", error);
    throw error.response?.data || { msg: "Error al obtener detalles del pedido" };
  }
};

/**
 * Crear nuevo detalle de pedido
 * @param {Object} data - { id_pedido, id_personalizacion, cantidad, precio_unitario }
 */
export const createDetallePedido = async (data) => {
  try {
    const res = await api.post(BASE_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear detalle de pedido:", error);
    throw error.response?.data || { msg: "Error al crear detalle de pedido" };
  }
};

/**
 * Actualizar un detalle de pedido existente
 * @param {number} id - ID del detalle
 * @param {Object} data - { id_pedido?, id_personalizacion?, cantidad?, precio_unitario? }
 */
export const updateDetallePedido = async (id, data) => {
  try {
    const res = await api.put(`${BASE_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar detalle de pedido:", error);
    throw error.response?.data || { msg: "Error al actualizar detalle de pedido" };
  }
};

/**
 * Eliminar un detalle de pedido
 * @param {number} id - ID del detalle
 */
export const deleteDetallePedido = async (id) => {
  try {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar detalle de pedido:", error);
    throw error.response?.data || { msg: "Error al eliminar detalle de pedido" };
  }
};