import api from "./api";

const BASE_URL = "/inventarios";

/**
 * Obtener lista completa del inventario
 */
export const listInventario = async () => {
  try {
    const res = await api.get(BASE_URL);
    return res.data;
  } catch (error) {
    console.error("Error al listar inventario:", error);
    throw error.response?.data || { msg: "Error al listar inventario" };
  }
};

/**
 * Obtener un inventario por ID
 * @param {number} id - ID del inventario
 */
export const getInventarioById = async (id) => {
  try {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener inventario por ID:", error);
    throw error.response?.data || { msg: "Error al obtener inventario" };
  }
};

/**
 * Crear nuevo registro en inventario
 * @param {Object} data - { id_personalizacion, stock, stock_minimo, precio_venta }
 */
export const createInventario = async (data) => {
  try {
    const res = await api.post(BASE_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear inventario:", error);
    throw error.response?.data || { msg: "Error al crear inventario" };
  }
};

/**
 * Actualizar un inventario existente
 * @param {number} id - ID del inventario
 * @param {Object} data - { id_personalizacion?, stock?, stock_minimo?, precio_venta? }
 */
export const updateInventario = async (id, data) => {
  try {
    const res = await api.put(`${BASE_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    throw error.response?.data || { msg: "Error al actualizar inventario" };
  }
};

/**
 * Eliminar un inventario
 * @param {number} id - ID del inventario
 */
export const deleteInventario = async (id) => {
  try {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
    throw error.response?.data || { msg: "Error al eliminar inventario" };
  }
};

/**
 * Obtener inventarios con stock bajo
 */
export const getStockBajo = async () => {
  try {
    const res = await api.get(`${BASE_URL}/stock-bajo`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener stock bajo:", error);
    throw error.response?.data || { msg: "Error al obtener stock bajo" };
  }
};

/**
 * Obtener inventarios por rango de fechas
 * @param {string} fecha_inicio - Fecha en formato YYYY-MM-DD
 * @param {string} fecha_fin - Fecha en formato YYYY-MM-DD
 */
export const getInventariosByFecha = async (fecha_inicio, fecha_fin) => {
  try {
    const res = await api.get(`${BASE_URL}/fecha`, {
      params: { fecha_inicio, fecha_fin }
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener inventarios por fecha:", error);
    throw error.response?.data || { msg: "Error al obtener inventarios por fecha" };
  }
};