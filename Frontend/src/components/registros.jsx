// ✅ Corregido
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { listRegistros, createRegistro } from "../services/registrosService";

const Registros = ({ token, onLogout }) => {
  const [registros, setRegistros] = useState([]);
  const [newRegistro, setNewRegistro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Debes iniciar sesión para ver registros");
      return;
    }
    fetchRegistros();
  }, [token]);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listRegistros(token);
      setRegistros(data);
    } catch (err) {
      console.error("Error al obtener registros:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        if (onLogout) onLogout();
      } else {
        setError("Error al cargar los registros");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegistro = async () => {
    if (!token) {
      setError("Debes iniciar sesión para crear registros");
      return;
    }
    if (!newRegistro.trim()) {
      setError("Por favor ingresa un nombre");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await createRegistro({ name: newRegistro }, token);
      setRegistros([...registros, data]);
      setNewRegistro("");
    } catch (err) {
      console.error("Error al crear registro:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        if (onLogout) onLogout();
      } else {
        setError("Error al crear el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateRegistro();
    }
  };

  if (!token) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>🔒 Acceso Restringido</h2>
        <p>Debes iniciar sesión para acceder a esta sección.</p>
        <button onClick={() => (window.location.href = "/login")}>
          Ir a Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>📋 Gestión de Registros</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>⚠️ {error}</div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={newRegistro}
          onChange={(e) => setNewRegistro(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un nuevo registro..."
          aria-label="Nuevo registro"
        />
        <button onClick={handleCreateRegistro} disabled={loading}>
          {loading ? "⏳ Guardando..." : "➕ Crear"}
        </button>
      </div>

      <h3>Lista de Registros ({registros.length})</h3>
      {registros.length === 0 ? (
        <p>No hay registros aún</p>
      ) : (
        <ul>
          {registros.map((registro, index) => (
            <li key={registro.id || index}>{registro.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

Registros.propTypes = {
  token:    PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Registros;