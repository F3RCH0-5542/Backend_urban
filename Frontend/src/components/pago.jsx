import React, { useState, useEffect } from "react";
import { listPagos, createPago, updatePago, deletePago } from "../services/pagoService";

const Pago = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({ id_pedido: "", metodo_pago: "Efectivo", monto: "" });
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPagos();
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.msg || "Error al obtener pagos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!form.id_pedido || !form.metodo_pago || !form.monto) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      const pagoData = {
        id_pedido: Number.parseInt(form.id_pedido),
        metodo_pago: form.metodo_pago,
        monto: Number.parseFloat(form.monto),
        fecha_pago: new Date().toISOString().split("T")[0],
      };

      if (editingId) {
        await updatePago(editingId, pagoData);
        setSuccess("¡Pago actualizado exitosamente!");
      } else {
        const created = await createPago(pagoData);
        setPagos((s) => [...s, created]);
        setSuccess("¡Pago creado exitosamente!");
      }

      await fetchPagos();
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.msg || "Error al gestionar pago");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pago) => {
    setEditingId(pago.id_pago);
    setForm({
      id_pedido: pago.id_pedido.toString(),
      metodo_pago: pago.metodo_pago,
      monto: pago.monto.toString(),
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setLoading(true);
      setError(null);
      await deletePago(deletingId);
      setSuccess("¡Pago eliminado exitosamente!");
      await fetchPagos();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.msg || "Error al eliminar pago");
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
    setForm({ id_pedido: "", metodo_pago: "Efectivo", monto: "" });
    setEditingId(null);
    setShowEditModal(false);
  };

  const getMetodoColor = (metodo) => {
    const colores = {
      "Efectivo": "#10b981",
      "Tarjeta": "#3b82f6",
      "Transferencia": "#8b5cf6",
    };
    return colores[metodo] || "#6366f1";
  };

  const getMetodoIcon = (metodo) => {
    const iconos = {
      "Efectivo": "💵",
      "Tarjeta": "💳",
      "Transferencia": "🏦",
    };
    return iconos[metodo] || "💰";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (!localStorage.getItem("token")) {
    return <div className="alert alert-warning mt-4">⚠️ Debes iniciar sesión para ver los pagos</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💰 Pagos</h2>
        <button
          className="btn btn-primary"
          onClick={() => !editingId && setShowEditModal(true)}
          disabled={editingId !== null}
        >
          + Nuevo Pago
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
                <h5 className="modal-title">{editingId ? "Editar Pago" : "Nuevo Pago"}</h5>
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
                    <label htmlFor="metodo_pago" className="form-label">Método de Pago *</label>
                    <select
                      id="metodo_pago"
                      name="metodo_pago"
                      value={form.metodo_pago}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                  </div>
              
                  <div className="mb-3">
                    <label htmlFor="monto" className="form-label">Monto *</label>
                    <input
                      id="monto"
                      type="number"
                      step="0.01"
                      name="monto"
                      value={form.monto}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Ej: 50000"
                    />
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
                <h5 className="modal-title">Eliminar Pago</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.</p>
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

      {/* Tabla de pagos */}
      {loading && !showEditModal && !showDeleteModal && <div className="text-center p-4">Cargando pagos...</div>}

      {!loading && pagos.length === 0 ? (
        <div className="alert alert-info text-center">No hay pagos registrados</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Pedido</th>
                <th>Método</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id_pago}>
                  <td>
                    <strong>#{pago.id_pago}</strong>
                  </td>
                  <td>{pago.id_pedido}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: getMetodoColor(pago.metodo_pago),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {getMetodoIcon(pago.metodo_pago)} {pago.metodo_pago}
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(pago.monto)}</strong>
                  </td>
                  <td>{pago.fecha_pago || "—"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(pago)}
                      disabled={editingId !== null}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openDeleteModal(pago.id_pago)}
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
};

export default Pago;