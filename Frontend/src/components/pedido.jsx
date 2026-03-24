import React, { useState, useEffect } from 'react';
import { listPedidos, createPedido, updatePedido, deletePedido } from '../services/pedidoService';

const Pedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [idUsuario, setIdUsuario] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [total, setTotal] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("⚠️ Debes iniciar sesión para ver los pedidos");
      return;
    }
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
      } else {
        setError(err.msg || "Error al cargar pedidos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      setError("⚠️ Debes iniciar sesión");
      return;
    }

    if (!idUsuario || !estado || !total) {
      setError("Los campos ID Usuario, Estado y Total son obligatorios");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const pedidoData = {
        id_usuario: Number.parseInt(idUsuario),
        estado: estado,
        total: Number.parseFloat(total),
        fecha_entrega: fechaEntrega || null,
        fecha_pedido: new Date().toISOString().split("T")[0]
      };

      if (editingId) {
        await updatePedido(editingId, pedidoData);
        setSuccess("¡Pedido actualizado exitosamente!");
      } else {
        await createPedido(pedidoData);
        setSuccess("¡Pedido creado exitosamente!");
      }

      await fetchPedidos();
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.msg || "Error al gestionar pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pedido) => {
    setEditingId(pedido.id_pedido);
    setIdUsuario(pedido.id_usuario.toString());
    setEstado(pedido.estado);
    setTotal(pedido.total.toString());
    setFechaEntrega(pedido.fecha_entrega ? pedido.fecha_entrega.split('T')[0] : '');
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setLoading(true);
      setError(null);
      await deletePedido(deletingId);
      setSuccess("¡Pedido eliminado exitosamente!");
      await fetchPedidos();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.msg || "Error al eliminar pedido");
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
    setIdUsuario('');
    setEstado('Pendiente');
    setTotal('');
    setFechaEntrega('');
    setEditingId(null);
    setShowEditModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Completado': '#10b981',
      'Pendiente': '#f59e0b',
      'Cancelado': '#ef4444',
      'En Proceso': '#3b82f6'
    };
    return colores[estado] || '#6366f1';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'Completado': '✅',
      'Pendiente': '⏳',
      'Cancelado': '❌',
      'En Proceso': '🔄'
    };
    return iconos[estado] || '📦';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin definir';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = pedidos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pedidos.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "500px",
          width: "100%",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔒</div>
          <h1 style={{
            margin: "0 0 16px 0",
            fontSize: "28px",
            fontWeight: "700",
            color: "#f1f5f9"
          }}>Acceso Restringido</h1>
          <p style={{
            margin: "0 0 32px 0",
            color: "#94a3b8",
            fontSize: "16px",
            lineHeight: "1.6"
          }}>
            Debes iniciar sesión para acceder a la gestión de pedidos.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
            }}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h1 style={{
              margin: "0 0 8px 0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              📦 Gestión de Pedidos
            </h1>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "16px" }}>
              Administra y registra todos tus pedidos
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "12px 24px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: "#7f1d1d",
            border: "1px solid #991b1b",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            color: "#fecaca",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <span style={{ fontWeight: "500" }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: "#064e3b",
            border: "1px solid #065f46",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            color: "#6ee7b7",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span style={{ fontSize: "24px" }}>✅</span>
            <span style={{ fontWeight: "500" }}>{success}</span>
          </div>
        )}

        {/* Lista de Pedidos */}
        <div style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
        }}>
          <h2 style={{
            margin: "0 0 24px 0",
            fontSize: "24px",
            fontWeight: "600",
            color: "#f1f5f9"
          }}>
            📋 Pedidos Registrados
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
              <p style={{ margin: 0, fontSize: "16px" }}>Cargando pedidos...</p>
            </div>
          ) : pedidos.length > 0 ? (
            <>
              <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
                {currentPedidos.map((pedido) => (
                  <div
                    key={pedido.id_pedido}
                    style={{
                      background: "#334155",
                      borderRadius: "12px",
                      padding: "20px",
                      borderLeft: `4px solid ${getEstadoColor(pedido.estado)}`
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "24px" }}>{getEstadoIcon(pedido.estado)}</span>
                        <div>
                          <h3 style={{
                            margin: "0 0 4px 0",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#f1f5f9"
                          }}>
                            Pedido #{pedido.id_pedido}
                          </h3>
                          <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                            Usuario #{pedido.id_usuario}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          background: getEstadoColor(pedido.estado),
                          color: "#fff",
                          padding: "6px 16px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600"
                        }}>
                          {pedido.estado}
                        </div>
                        <button
                          onClick={() => handleEdit(pedido)}
                          style={{
                            padding: "8px 16px",
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => openDeleteModal(pedido.id_pedido)}
                          style={{
                            padding: "8px 16px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "16px",
                      padding: "16px",
                      background: "#1e293b",
                      borderRadius: "8px"
                    }}>
                      <div>
                        <p style={{
                          margin: "0 0 4px 0",
                          fontSize: "12px",
                          color: "#94a3b8",
                          fontWeight: "600"
                        }}>TOTAL</p>
                        <p style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#10b981"
                        }}>
                          {formatCurrency(pedido.total)}
                        </p>
                      </div>
                      <div>
                        <p style={{
                          margin: "0 0 4px 0",
                          fontSize: "12px",
                          color: "#94a3b8",
                          fontWeight: "600"
                        }}>FECHA PEDIDO</p>
                        <p style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#f1f5f9",
                          fontWeight: "500"
                        }}>
                          📅 {formatDate(pedido.fecha_pedido)}
                        </p>
                      </div>
                      <div>
                        <p style={{
                          margin: "0 0 4px 0",
                          fontSize: "12px",
                          color: "#94a3b8",
                          fontWeight: "600"
                        }}>FECHA ENTREGA</p>
                        <p style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#f1f5f9",
                          fontWeight: "500"
                        }}>
                          🚚 {formatDate(pedido.fecha_entrega)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid #334155"
                }}>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    style={{
                      padding: "10px 16px",
                      background: currentPage === 1 ? "#475569" : "#64748b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    ← Anterior
                  </button>

                  — new Array() en lugar de Array()
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[...new Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            style={{
                              padding: "10px 14px",
                              background: currentPage === pageNumber ? "#6366f1" : "#334155",
                              color: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              minWidth: "40px"
                            }}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} style={{ color: "#64748b", padding: "10px 4px" }}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "10px 16px",
                      background: currentPage === totalPages ? "#475569" : "#64748b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ margin: 0, fontSize: "16px" }}>No hay pedidos registrados</p>
            </div>
          )}
        </div>

        {/* Formulario */}
        <div style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h2 style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
              color: "#f1f5f9"
            }}>
              {editingId ? "✏️ Editar Pedido" : "➕ Crear Nuevo Pedido"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                style={{
                  padding: "8px 16px",
                  background: "#64748b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ❌ Cancelar
              </button>
            )}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px"
          }}>
            
            <div>
              <label htmlFor="id_usuario" style={{
                display: "block", marginBottom: "8px",
                fontSize: "14px", fontWeight: "600", color: "#cbd5e1"
              }}>ID Usuario *</label>
              <input
                id="id_usuario"
                type="number"
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                placeholder="Ej: 1001"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "2px solid #334155", borderRadius: "8px",
                  fontSize: "14px", color: "#f1f5f9",
                  background: "#0f172a", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label htmlFor="estado" style={{
                display: "block", marginBottom: "8px",
                fontSize: "14px", fontWeight: "600", color: "#cbd5e1"
              }}>Estado *</label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "2px solid #334155", borderRadius: "8px",
                  fontSize: "14px", color: "#f1f5f9",
                  background: "#0f172a", outline: "none",
                  boxSizing: "border-box", cursor: "pointer"
                }}
              >
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="En Proceso">🔄 En Proceso</option>
                <option value="Completado">✅ Completado</option>
                <option value="Cancelado">❌ Cancelado</option>
              </select>
            </div>

            <div>
              <label htmlFor="total" style={{
                display: "block", marginBottom: "8px",
                fontSize: "14px", fontWeight: "600", color: "#cbd5e1"
              }}>Total *</label>
              <input
                id="total"
                type="number"
                step="0.01"
                min="0"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="0.00"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "2px solid #334155", borderRadius: "8px",
                  fontSize: "14px", color: "#f1f5f9",
                  background: "#0f172a", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label htmlFor="fecha_entrega" style={{
                display: "block", marginBottom: "8px",
                fontSize: "14px", fontWeight: "600", color: "#cbd5e1"
              }}>Fecha de Entrega</label>
              <input
                id="fecha_entrega"
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #334155",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#f1f5f9",
                  background: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <button
            onClick={handleCreateOrUpdate}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#475569" : (editingId ? "#3b82f6" : "#10b981"),
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Procesando..." : (editingId ? "💾 Actualizar Pedido" : "✅ Crear Pedido")}
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
          }}>
            <div style={{ fontSize: "48px", textAlign: "center", marginBottom: "20px" }}>⚠️</div>
            <h3 style={{
              margin: "0 0 16px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "#f1f5f9",
              textAlign: "center"
            }}>
              ¿Confirmar eliminación?
            </h3>
            <p style={{
              margin: "0 0 32px 0",
              color: "#94a3b8",
              fontSize: "16px",
              textAlign: "center"
            }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#64748b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedido;