// src/services/pedidoService.js
import api from "./api";

const BASE_URL = "/pedidos"; // 👈 Usa la ruta correcta del backend (con 's')

// Listar pedidos
export const listPedidos = async () => {
  try {
    const response = await api.get(BASE_URL);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error en listPedidos:", error.response?.data || error);
    throw {
      msg: error.response?.data?.msg || "Error al listar pedidos",
      status: error.response?.status,
      ...error.response?.data
    };
  }
};

// Crear pedido
export const createPedido = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error en createPedido:", error.response?.data || error);
    throw {
      msg: error.response?.data?.msg || "Error al crear pedido",
      status: error.response?.status,
      ...error.response?.data
    };
  }
};

// Obtener pedido por ID
export const getPedidoById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error en getPedidoById:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al obtener pedido" };
  }
};

// Actualizar pedido
export const updatePedido = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error en updatePedido:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al actualizar pedido" };
  }
};

// Eliminar pedido
export const deletePedido = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en deletePedido:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al eliminar pedido" };
  }
};