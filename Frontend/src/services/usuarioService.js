import api from "./api";

export const getUsuarios = () =>
  api.get("/usuarios").then((r) => r.data);

export const getUsuarioPorId = (id) =>
  api.get(`/usuarios/${id}`).then((r) => r.data);

export const crearUsuario = (datos) =>
  api.post("/usuarios", datos).then((r) => r.data);

export const actualizarUsuario = (id, datos) =>
  api.put(`/usuarios/${id}`, datos).then((r) => r.data);

export const actualizarUsuarioParcial = (id, datos) =>
  api.patch(`/usuarios/${id}`, datos).then((r) => r.data);

export const toggleEstadoUsuario = (id) =>
  api.patch(`/usuarios/${id}/status`).then((r) => r.data);

export const eliminarUsuario = (id) =>
  api.delete(`/usuarios/${id}`).then((r) => r.data);

export const getPerfil = () =>
  api.get("/usuarios/perfil").then((r) => r.data);

export const actualizarPerfil = (datos) =>
  api.put("/usuarios/perfil", datos).then((r) => r.data);

export const cambiarContrasena = (clave_actual, clave_nueva) =>
  api.put("/usuarios/cambiar-contrasena", { clave_actual, clave_nueva }).then((r) => r.data);