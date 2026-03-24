// personalizacionService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/personalizaciones';

// Función helper para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const createPersonalizacion = async (personalizacionData) => {
  try {
    console.log('📤 Enviando personalización:', personalizacionData);
    const response = await axios.post(API_URL, personalizacionData, getAuthHeaders());
    console.log('✅ Personalización creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en createPersonalizacion:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const listPersonalizaciones = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error al listar:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const updatePersonalizacion = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const deletePersonalizacion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar:', error.response?.data || error);
    throw error.response?.data || error;
  }
};