// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Ajusta tu URL

export const login = async (correo, contrasena) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, {
      correo,
      contrasena
    });

    if (response.data.token) {
      // Guardar token
      localStorage.setItem('token', response.data.token);
      
      // Guardar rol del usuario
      const userRole = response.data.rol || response.data.usuario?.rol || 'usuario';
      localStorage.setItem('userRole', userRole);
      
      // Guardar datos del usuario (opcional)
      localStorage.setItem('userData', JSON.stringify(response.data.usuario));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error al iniciar sesión' };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/registro`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error al registrarse' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'usuario';
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};