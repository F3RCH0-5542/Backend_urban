import React, { useEffect, useState } from "react";
import { listEnvios, createEnvio, updateEnvio, deleteEnvio } from "../services/envioService";

export default function Envios() {
  const [envios, setEnvios] = useState([]);
  const [form, setForm] = useState({ id_pedido: "", direccion: "", estado: "pendiente" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchEnvios();
  }, []);

  const fetchEnvios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listEnvios();
      setEnvios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.msg || "Error al obtener envíos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!form.id_pedido || !form.direccion) {
      setError("Pedido y dirección requeridos");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      const envioData = {
        id_pedido: Number(form.id_pedido),
        direccion: form.direccion,
        estado: form.estado,
      };

      if (editingId) {
        await updateEnvio(editingId, envioData);
        setSuccess("¡Envío actualizado exitosamente!");
      } else {
        const created = await createEnvio(envioData);
        setEnvios((s) => [...s, created]);
        setSuccess("¡Envío creado exitosamente!");
      }

      await fetchEnvios();
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.msg || "Error al gestionar envío");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (envio) => {
    setEditingId(envio.id || envio.id_envio);
    setForm({
      id_pedido: envio.id_pedido.toString(),
      direccion: envio.direccion,
      estado: envio.estado,
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setLoading(true);
      setError(null);
      await deleteEnvio(deletingId);
      setSuccess("¡Envío eliminado exitosamente!");
      await fetchEnvios();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.msg || "Error al eliminar envío");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setForm({ id_pedido: "", direccion: "", estado: "pendiente" });
    setEditingId(null);
    setShowEditModal(false);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'entregado': '#10b981',
      'pendiente': '#f59e0b',
      'enviado': '#3b82f6',
    };
    return colores[estado] || '#6366f1';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'entregado': '✅',
      'pendiente': '⏳',
      'enviado': '🚚',
    };
    return iconos[estado] || '📦';
  };

  if (!localStorage.getItem("token")) {
    return <div className="alert alert-warning mt-4">⚠️ Debes iniciar sesión para ver los envíos</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Envíos</h2>
        <button
          className="btn btn-primary"
          onClick={() => !editingId && setShowEditModal(true)}
          disabled={editingId !== null}
        >
          + Nuevo Envío
        </button>
      </div>

      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}

      {/* Modal para crear/editar */}
      {showEditModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? "Editar Envío" : "Nuevo Envío"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>

              <form onSubmit={handleCreateOrUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="id_pedido" className="form-label">ID Pedido *</label>
                    <input
                      id="id_pedido"
                      type="number"
                      name="id_pedido"
                      value={form.id_pedido}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Ej: 1"
                      disabled={editingId !== null}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección *</label>
                    <input
                      id="direccion"
                      type="text"
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Dirección de entrega"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      id="estado"
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : editingId ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Eliminar Envío</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este envío? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingId(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de envíos */}
      {loading && !showEditModal && !showDeleteModal && <div className="text-center p-4">Cargando envíos...</div>}

      {!loading && envios.length === 0 ? (
        <div className="alert alert-info text-center">No hay envíos registrados</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Pedido</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {envios.map(ev => (
                <tr key={ev.id || ev.id_envio}>
                  <td><strong>#{ev.id || ev.id_envio}</strong></td>
                  <td>{ev.id_pedido}</td>
                  <td>{ev.direccion}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getEstadoColor(ev.estado),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {getEstadoIcon(ev.estado)}{" "}
                      {ev.estado
                        ? ev.estado.charAt(0).toUpperCase() + ev.estado.slice(1)
                        : "Sin estado"}

                    </span>
                  </td>
                  <td>{ev.fechaEnvio || ev.fecha_envio || "—"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(ev)}
                      disabled={editingId !== null}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openDeleteModal(ev.id || ev.id_envio)}
                      disabled={editingId !== null}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
