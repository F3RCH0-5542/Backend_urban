import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const guardado = localStorage.getItem("usuarioUrbanCops");
    return guardado ? JSON.parse(guardado) : null;
  });

  const login = (data) => {
    setUser(data);
    localStorage.setItem("usuarioUrbanCops", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuarioUrbanCops");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Fix: children declarado en propTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};