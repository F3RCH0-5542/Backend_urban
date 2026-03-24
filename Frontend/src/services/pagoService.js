// src/services/pagoService.js
import api from "./api";

const BASE_URL = "/pagos";

// Crear un pago
export const createPago = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error en createPago:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al crear pago" };
  }
};

// Listar pagos
export const listPagos = async () => {
  try {
    const response = await api.get(BASE_URL);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error en listPagos:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al listar pagos" };
  }
};

// Obtener un pago por ID
export const getPagoById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error en getPagoById:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al obtener pago" };
  }
};

// Actualizar un pago
export const updatePago = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error en updatePago:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al actualizar pago" };
  }
};

// Eliminar un pago
export const deletePago = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en deletePago:", error.response?.data || error);
    throw error.response?.data || { msg: "Error al eliminar pago" };
  }
};