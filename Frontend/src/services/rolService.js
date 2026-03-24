// src/services/rolService.js
import api from "./api";

const BASE_URL = "/roles";

// Listar roles
export const listRoles = async () => {
  const res = await api.get(BASE_URL);
  return res.data;
};

// Crear rol
export const createRol = async (data) => {
  // data debe tener { nombre_rol, descripcion }
  const res = await api.post(BASE_URL, data);
  return res.data.rol || res.data; // tu backend devuelve { msg, rol }
};

// Actualizar rol
export const updateRol = async (id, data) => {
  const res = await api.put(`${BASE_URL}/${id}`, data);
  return res.data.rol || res.data;
};

// Eliminar rol
export const deleteRol = async (id) => {
  const res = await api.delete(`${BASE_URL}/${id}`);
  return res.data;
};
