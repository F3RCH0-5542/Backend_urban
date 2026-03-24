import React, { useState, useEffect } from "react";
import { listUsuarios, createUsuario } from "../services/usuarioService";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await listUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleCreateUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.trim()) return;

    try {
      const data = await createUsuario({ nombre: nuevoUsuario });
      setUsuarios([...usuarios, data]);
      setNuevoUsuario("");
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>

      <ul className="list-group mb-3">
        {usuarios.map((usuario) => (
          <li key={usuario.id} className="list-group-item">
            {usuario.nombre} ({usuario.correo})
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreateUsuario} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          value={nuevoUsuario}
          onChange={(e) => setNuevoUsuario(e.target.value)}
          placeholder="Nuevo usuario"
        />
        <button type="submit" className="btn btn-primary">
          Crear
        </button>
      </form>
    </div>
  );
};

export default Usuarios;
