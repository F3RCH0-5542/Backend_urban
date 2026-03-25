import api from "./api";

// 🔑 LOGIN
export const login = async (correo, clave) => {
  try {
    const response = await api.post("/auth/login", { correo, clave });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      const userRole = response.data.rol || response.data.usuario?.rol || "usuario";
      localStorage.setItem("userRole", userRole);

      localStorage.setItem("userData", JSON.stringify(response.data.usuario));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: "Error al iniciar sesión" };
  }
};

// 📝 REGISTRO
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: "Error al registrarse" };
  }
};

// 🚪 LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userData");
};

// 👤 OBTENER USUARIO ACTUAL
export const getCurrentUser = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

// 🎭 OBTENER ROL
export const getUserRole = () => {
  return localStorage.getItem("userRole") || "usuario";
};

// ✅ VERIFICACIONES
export const isAdmin = () => getUserRole() === "admin";
export const isAuthenticated = () => !!localStorage.getItem("token");