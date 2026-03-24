import axios from "axios";

const API_URL = "http://localhost:3001/api/registros";

// Listar registros
export const listRegistros = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en listRegistros:", error);
    throw error;
  }
};

// Crear nuevo registro
export const createRegistro = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en createRegistro:", error);
    throw error;
  }
};
