import { useEffect, useState } from "react";
import Sidebar from "../componente/sidebar";
import "./usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    correo: "",
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editId, setEditId] = useState(null);
  const API_URL = "http://localhost/urban/backend";

  const parseJSON = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ El servidor no devolvió JSON válido:", text);
      throw new Error("Respuesta no válida del servidor");
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/usuarios.php`)
      .then(parseJSON)
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editando) {
      fetch(`${API_URL}/editar_usuario.php?id=${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(parseJSON)
        .then((data) => {
          alert(data.message || "Usuario actualizado");
          setUsuarios(
            usuarios.map((u) =>
              u.id_usuario === editId ? { ...u, ...form, id_usuario: editId } : u
            )
          );
          setForm({ nombre: "", apellido: "", documento: "", correo: "" });
          setEditando(false);
          setEditId(null);
        })
        .catch((err) => console.error("Error actualizando:", err));
    } else {
      fetch(`${API_URL}/registro.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(parseJSON)
        .then((data) => {
          alert(data.message || "Usuario registrado");
          if (data.usuario) {
            setUsuarios([...usuarios, data.usuario]);
          }
          setForm({ nombre: "", apellido: "", documento: "", correo: "" });
          setFormSuccess(true);
          setTimeout(() => setFormSuccess(false), 3000);
        })
        .catch((err) => console.error("Error registrando:", err));
    }
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este registro?")) return;
    fetch(`${API_URL}/eliminar_usuario.php?id=${id}`, {
      method: "DELETE",
    })
      .then(parseJSON)
      .then((data) => {
        alert(data.message || "Usuario eliminado");
        setUsuarios(usuarios.filter((u) => u.id_usuario !== id));
      })
      .catch((err) => console.error("Error eliminando:", err));
  };

  const editar = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      documento: usuario.documento,
      correo: usuario.correo,
    });
    setEditando(true);
    setEditId(usuario.id_usuario);
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "220px" }}>
        <div className="container py-4">
          <h1 className="text-center text-dark mb-4">Gestión Usuarios</h1>

          {/* FORMULARIO */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-6 bg-white p-4 rounded shadow formulario-container">
              {formSuccess && (
                <div className="alert alert-success" role="alert">
                  Registro exitoso
                </div>
              )}
              <h3 className="text-center text-dark mb-4">
                {editando ? "Editar Usuario" : "Registro personas"}
              </h3>
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  {/* ✅ Fix: htmlFor + id asociados */}
                  <label htmlFor="nombre" className="form-label text-dark">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  {/* ✅ Fix: htmlFor + id asociados */}
                  <label htmlFor="apellido" className="form-label text-dark">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    type="text"
                    name="apellido"
                    className="form-control"
                    value={form.apellido}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  {/* ✅ Fix: htmlFor + id asociados */}
                  <label htmlFor="documento" className="form-label text-dark">
                    Documento
                  </label>
                  <input
                    id="documento"
                    type="text"
                    name="documento"
                    className="form-control"
                    value={form.documento}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  {/* ✅ Fix: htmlFor + id asociados */}
                  <label htmlFor="correo" className="form-label text-dark">
                    Correo
                  </label>
                  <input
                    id="correo"
                    type="email"
                    name="correo"
                    className="form-control"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {editando ? "Actualizar" : "Registrar"}
                </button>
              </form>
            </div>
          </div>

          {/* TABLA */}
          <div className="row">
            <div className="col bg-white p-4 rounded shadow">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Documento</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id_usuario}>
                      <td>{u.id_usuario}</td>
                      <td>{u.nombre}</td>
                      <td>{u.apellido}</td>
                      <td>{u.documento}</td>
                      <td>{u.correo}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editar(u)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminar(u.id_usuario)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}