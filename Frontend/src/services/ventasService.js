import api from "./api";

const BASE = "/ventas";

// Listar todas las ventas
export const listVentas = async (token) => {
  const res = await api.get(BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data || res.data;
};

// Crear nueva venta
export const createVenta = async (data, token) => {
  const res = await api.post(BASE, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.venta || res.data;
};

// Actualizar venta
export const updateVenta = async (id, data, token) => {
  const res = await api.put(`${BASE}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.venta || res.data;
};

// Eliminar venta
export const deleteVenta = async (id, token) => {
  const res = await api.delete(`${BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Obtener ventas por usuario
export const getVentasByUsuario = async (id_usuario, token) => {
  const res = await api.get(`${BASE}/usuario/${id_usuario}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data || res.data;
};

// Obtener ventas por fecha
export const getVentasByFecha = async (fecha_inicio, fecha_fin, token) => {
  const res = await api.get(`${BASE}/fecha`, {
    params: { fecha_inicio, fecha_fin },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data || res.data;
};

// Obtener estadísticas de ventas
export const getEstadisticasVentas = async (token) => {
  const res = await api.get(`${BASE}/estadisticas`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};