import React, { useEffect, useState } from "react";
import {
  listDetallesPedidos,
  createDetallePedido,
  updateDetallePedido,
  deleteDetallePedido,
  getDetallesByPedido
} from "../services/detallePedidoService";

const DetallePedido = () => {
  const [detalles, setDetalles] = useState([]);
  const [formData, setFormData] = useState({
    id_pedido: "",
    id_personalizacion: "",
    cantidad: "",
    precio_unitario: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterPedido, setFilterPedido] = useState("");

  useEffect(() => {
    fetchDetalles();
  }, []);

  const fetchDetalles = async () => {
    setLoading(true);
    try {
      const data = await listDetallesPedidos();
      setDetalles(data);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      alert("Error al cargar los detalles de pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateDetallePedido(editingId, formData);
        alert("Detalle actualizado correctamente");
        setEditingId(null);
      } else {
        await createDetallePedido(formData);
        alert("Detalle creado correctamente");
      }

      setFormData({
        id_pedido: "",
        id_personalizacion: "",
        cantidad: "",
        precio_unitario: ""
      });
      setShowForm(false);
      await fetchDetalles();
    } catch (error) {
      console.error("Error al guardar detalle:", error);
      alert(error.msg || "Error al guardar el detalle");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_pedido: item.id_pedido,
      id_personalizacion: item.id_personalizacion,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    });
    setEditingId(item.id_detalle);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este detalle?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteDetallePedido(id);
      alert("Detalle eliminado correctamente");
      await fetchDetalles();
    } catch (error) {
      console.error("Error al eliminar detalle:", error);
      alert(error.msg || "Error al eliminar el detalle");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id_pedido: "",
      id_personalizacion: "",
      cantidad: "",
      precio_unitario: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFilterByPedido = async () => {
    if (!filterPedido) {
      fetchDetalles();
      return;
    }

    setLoading(true);
    try {
      const data = await getDetallesByPedido(filterPedido);
      setDetalles(data);
    } catch (error) {
      console.error("Error al filtrar:", error);
      alert("Error al filtrar por pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilterPedido("");
    fetchDetalles();
  };

  // Calcular totales
  const totalDetalles = detalles.length;
  const totalUnidades = detalles.reduce((sum, item) => sum + Number.parseInt(item.cantidad || 0), 0);
  const totalVentas = detalles.reduce((sum, item) => sum + Number.parseFloat(item.subtotal || 0), 0);
  const promedioTicket = totalDetalles > 0 ? totalVentas / totalDetalles : 0;

  return (
    <div className="bg-dark min-vh-100 py-4">
      <style>{`
        .bg-dark-card {
          background: #1a1d29;
          border: 1px solid #2d3142;
        }
        .bg-darker {
          background: #0f111a;
        }
        .text-muted-dark {
          color: #8892ab !important;
        }
        .btn-dark-custom {
          background: #2d3142;
          border: 1px solid #3d4152;
          color: #fff;
        }
        .btn-dark-custom:hover {
          background: #3d4152;
          border-color: #4d5162;
          color: #fff;
        }
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .stat-card-success {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
        }
        .stat-card-info {
          background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
        }
        .stat-card-warning {
          background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
        }
        .detail-card {
          background: #1a1d29;
          border: 1px solid #2d3142;
          border-radius: 12px;
          transition: all 0.3s;
        }
        .detail-card:hover {
          transform: translateY(-5px);
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        }
        .form-control-dark {
          background: #0f111a;
          border: 1px solid #2d3142;
          color: #fff;
        }
        .form-control-dark:focus {
          background: #0f111a;
          border-color: #667eea;
          color: #fff;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .form-control-dark::placeholder {
          color: #5a607f;
        }
        .btn-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
        }
        .btn-gradient-primary:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          color: white;
        }
        .btn-gradient-success {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
          border: none;
          color: white;
        }
        .btn-gradient-success:hover {
          background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
          color: white;
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
              
                <h2 className="text-white mb-1 fw-bold">
                  <i className="bi bi-receipt me-2"></i>Detalles de Pedidos
                </h2>
                <p className="text-muted-dark mb-0">Gestiona los productos de cada pedido</p>
              </div>
              <button
                className="btn btn-gradient-primary px-4"
                onClick={() => setShowForm(!showForm)}
              >
                <i className={`bi ${showForm ? 'bi-x-circle' : 'bi-plus-circle'} me-2`}></i>
                {showForm ? 'Cancelar' : 'Nuevo Detalle'}
              </button>
            </div>
          </div>
        </div>

        {/* Filtro por pedido */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-dark-card rounded-3 p-3">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-7 col-lg-8">
                  <label htmlFor="filtrar-pedido" className="form-label text-white fw-bold small mb-2">
                    <i className="bi bi-funnel me-1"></i>Filtrar por Pedido
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-dark"
                    placeholder="Ingresa el ID del pedido..."
                    value={filterPedido}
                    onChange={(e) => setFilterPedido(e.target.value)}
                  />
                </div>
                <div className="col-6 col-md-3 col-lg-2">
                  <button
                    className="btn btn-gradient-primary w-100"
                    onClick={handleFilterByPedido}
                  >
                    <i className="bi bi-search me-2"></i>Buscar
                  </button>
                </div>
                <div className="col-6 col-md-2 col-lg-2">
                  <button
                    className="btn btn-dark-custom w-100"
                    onClick={handleClearFilter}
                  >
                    <i className="bi bi-x-circle me-2"></i>Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="bg-dark-card rounded-3 p-4 shadow">
                <h5 className="text-white mb-3 fw-bold">
                  <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-square'} me-2`}></i>
                  {editingId ? 'Editar Detalle' : 'Nuevo Detalle'}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6 col-lg-3">

                      <label htmlFor="id-pedido" className="form-label text-white fw-bold small">
                        <i className="bi bi-basket me-1"></i>ID Pedido
                      </label>
                      <input
                        type="number"
                        name="id_pedido"
                        value={formData.id_pedido}
                        onChange={handleChange}
                        className="form-control form-control-dark"
                        placeholder="Ej: 1"
                        required
                      />
                    </div>


                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="id-personalizacion" className="form-label text-white fw-bold small">
                        <i className="bi bi-palette me-1"></i>ID Personalización
                      </label>
                      <input
                        type="number"
                        name="id_personalizacion"
                        value={formData.id_personalizacion}
                        onChange={handleChange}
                        className="form-control form-control-dark"
                        placeholder="Ej: 1"
                        required
                      />
                    </div>


                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="cantidad" className="form-label text-white fw-bold small">
                        <i className="bi bi-123 me-1"></i>Cantidad
                      </label>
                      <input
                        id="cantidad"
                        type="number"
                        name="cantidad"
                        value={formData.cantidad}
                        onChange={handleChange}
                        className="form-control form-control-dark"
                        placeholder="Ej: 2"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <label htmlFor="precio-unitario" className="form-label text-white fw-bold small">
                        <i className="bi bi-currency-dollar me-1"></i>Precio Unitario
                      </label>
                      <input
                        type="number"
                        name="precio_unitario"
                        value={formData.precio_unitario}
                        onChange={handleChange}
                        className="form-control form-control-dark"
                        placeholder="25000"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <div className="d-flex gap-2 flex-column flex-sm-row">
                        <button
                          type="submit"
                          className="btn btn-gradient-success flex-grow-1"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              {editingId ? 'Actualizando...' : 'Guardando...'}
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              {editingId ? 'Actualizar' : 'Guardar'}
                            </>
                          )}
                        </button>
                        {editingId && (

                          <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-dark-custom"
                            disabled={loading}
                          >
                            <i className="bi bi-x-circle me-2"></i>Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card rounded-3 p-3 shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-white">
                  <p className="mb-1 small opacity-75">Total Detalles</p>
                  <h3 className="mb-0 fw-bold">{totalDetalles}</h3>
                </div>
                <i className="bi bi-receipt" style={{ fontSize: '2.5rem', opacity: 0.6 }}></i>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-success rounded-3 p-3 shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-white">
                  <p className="mb-1 small opacity-75">Unidades</p>
                  <h3 className="mb-0 fw-bold">{totalUnidades}</h3>
                </div>
                <i className="bi bi-boxes" style={{ fontSize: '2.5rem', opacity: 0.6 }}></i>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-info rounded-3 p-3 shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-white">
                  <p className="mb-1 small opacity-75">Total Ventas</p>
                  <h3 className="mb-0 fw-bold">${(totalVentas / 1000).toFixed(0)}K</h3>
                </div>
                <i className="bi bi-cash-stack" style={{ fontSize: '2.5rem', opacity: 0.6 }}></i>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-warning rounded-3 p-3 shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-white">
                  <p className="mb-1 small opacity-75">Promedio</p>
                  <h3 className="mb-0 fw-bold">${promedioTicket.toFixed(0)}</h3>
                </div>
                <i className="bi bi-graph-up-arrow" style={{ fontSize: '2.5rem', opacity: 0.6 }}></i>
              </div>
            </div>
          </div>
        </div>

        {loading && !showForm ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted-dark">Cargando detalles...</p>
          </div>
        ) : detalles.length === 0 ? (
          <div className="bg-dark-card rounded-3 p-5 text-center shadow">
            <i className="bi bi-inbox text-muted-dark" style={{ fontSize: '4rem' }}></i>
            <p className="text-muted-dark mt-3 mb-3">No hay detalles de pedidos registrados</p>

            <button
              className="btn btn-gradient-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>Crear primer detalle
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {detalles.map((item) => {
              return (
                <div key={item.id_detalle} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="detail-card p-3 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-secondary mb-2">Detalle #{item.id_detalle}</span>
                        <h6 className="text-white mb-0">Pedido #{item.id_pedido}</h6>
                      </div>
                      <span className="badge" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        Personalización #{item.id_personalizacion}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted-dark small">Cantidad:</span>
                        <span className="text-white fw-bold">{item.cantidad} unidades</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted-dark small">Precio unitario:</span>
                        <span className="text-success fw-bold">${Number.parseFloat(item.precio_unitario).toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted-dark small">Subtotal:</span>
                        <span className="text-info fw-bold">${Number.parseFloat(item.subtotal).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-warning flex-grow-1"
                        onClick={() => handleEdit(item)}
                        title="Editar"
                      >

                        <i className="bi bi-pencil me-1"></i>{' '}Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id_detalle)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallePedido;