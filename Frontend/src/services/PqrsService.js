// src/services/PqrsService.js
import axios from 'axios';

// ⚠️ IMPORTANTE: Tu backend está en el puerto 3001, NO en 8080
const API_URL = 'http://localhost:3001/api/pqrs';

// Configurar el token en las peticiones
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Listar todas las PQRS
export const listPqrs = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error al listar PQRS:', error);
    throw error.response?.data || { msg: 'Error al obtener PQRS' };
  }
};

// Crear una nueva PQRS
export const createPqrs = async (pqrsData) => {
  try {
    const response = await axios.post(API_URL, pqrsData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear PQRS:', error);
    throw error.response?.data || { msg: 'Error al crear PQRS' };
  }
};

// Obtener una PQRS por ID
export const getPqrsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener PQRS:', error);
    throw error.response?.data || { msg: 'Error al obtener PQRS' };
  }
};

// Actualizar una PQRS
export const updatePqrs = async (id, pqrsData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, pqrsData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar PQRS:', error);
    throw error.response?.data || { msg: 'Error al actualizar PQRS' };
  }
};

// Eliminar una PQRS
export const deletePqrs = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar PQRS:', error);
    throw error.response?.data || { msg: 'Error al eliminar PQRS' };
  }
};

// Actualizar el estado de una PQRS
export const updatePqrsEstado = async (id, estado, respuesta = '') => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/estado`, 
      { estado, respuesta },
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error.response?.data || { msg: 'Error al actualizar estado' };
  }
};