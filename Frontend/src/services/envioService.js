// src/services/envioService.js
import api from "./api";

const BASE = "/envios";

// Obtener lista de envíos
export const listEnvios = async () => {
  const res = await api.get(BASE); // GET /api/envios con token
  return res.data;
};

// Crear nuevo envío
export const createEnvio = async (data) => {
  const res = await api.post(BASE, data); // POST /api/envios con token
  return res.data;
};

// Actualizar envío
export const updateEnvio = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data); // PUT /api/envios/:id con token
  return res.data;
};

// Eliminar envío
export const deleteEnvio = async (id) => {
  const res = await api.delete(`${BASE}/${id}`); // DELETE /api/envios/:id con token
  return res.data;
};
