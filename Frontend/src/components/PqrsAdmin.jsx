import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPqrs, createPqrs, updatePqrs, deletePqrs } from '../services/PqrsService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PqrsAdmin = () => {
  const navigate = useNavigate();
  const [pqrsList, setPqrsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPqrs, setSelectedPqrs] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    tipo: '',
    mensaje: '',
    estado: 'Pendiente',
    respuesta: ''
  });

  useEffect(() => {
    fetchPqrs();
  }, []);

  const fetchPqrs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPqrs();
      setPqrsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener PQRS:', err);
      setError(err.msg || 'Error al cargar PQRS');
      setPqrsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const dataToSend = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        tipo_pqrs: formData.tipo,
        descripcion: formData.mensaje.trim(),
        estado: formData.estado,
        respuesta: formData.respuesta?.trim() || ''
      };
      if (modalMode === 'create') {
        await createPqrs(dataToSend);
        alert('PQRS creada exitosamente');
      } else {
        await updatePqrs(selectedPqrs.id_pqrs, dataToSend);
        alert('PQRS actualizada exitosamente');
      }
      await fetchPqrs();
      closeModal();
    } catch (err) {
      console.error('Error:', err);
      setError(err.msg || 'Error al procesar la solicitud');
      alert(err.msg || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta PQRS?')) return;
    try {
      setLoading(true);
      await deletePqrs(id);
      alert('PQRS eliminada exitosamente');
      await fetchPqrs();
    } catch (err) {
      console.error('Error:', err);
      alert(err.msg || 'Error al eliminar PQRS');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ nombre: '', correo: '', tipo: '', mensaje: '', estado: 'Pendiente', respuesta: '' });
    setShowModal(true);
  };

  const openEditModal = (pqrs) => {
    setModalMode('edit');
    setSelectedPqrs(pqrs);
    setFormData({
      nombre: pqrs.nombre || '',
      correo: pqrs.correo || '',
      tipo: pqrs.tipo || '',
      mensaje: pqrs.descripcion || '',
      estado: pqrs.estado || 'Pendiente',
      respuesta: pqrs.respuesta || ''
    });
    setShowModal(true);
  };

  const openViewModal = (pqrs) => {
    setSelectedPqrs(pqrs);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowViewModal(false);
    setSelectedPqrs(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredPqrs = pqrsList.filter(pqrs => {
    const matchSearch = (pqrs.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqrs.correo?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchTipo = filterTipo === '' || pqrs.tipo === filterTipo;
    const matchEstado = filterEstado === '' || pqrs.estado === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  const stats = {
    total: pqrsList.length,
    pendientes: pqrsList.filter(p => p.estado === 'Pendiente').length,
    proceso: pqrsList.filter(p => p.estado === 'En Proceso').length,
    resueltos: pqrsList.filter(p => p.estado === 'Resuelto').length
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'bg-warning text-dark',
      'En Proceso': 'bg-info text-dark',
      'Resuelto': 'bg-success',
      'Cerrado': 'bg-secondary'
    };
    return badges[estado] || 'bg-secondary';
  };

  const getTipoIcon = (tipo) => {
    const icons = { 'Queja': '🔴', 'Reclamo': '⚠️', 'Sugerencia': '💡' };
    return icons[tipo] || '📝';
  };

  return (
    <div className="pqrs-admin-wrapper">
      {/* Header */}
      <div className="admin-header-bar bg-gradient-dark text-white py-4 mb-4 shadow-lg">
        <div className="container-fluid px-4">
          <div className="row align-items-center">
            <div className="col-md-3">
              <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/admin')}>
                {/* ✅ FIX: texto pegado al </i> */}
                <i className="bi bi-arrow-left me-2"></i>Volver
              </button>
            </div>
            <div className="col-md-6 text-center">
              <h1 className="mb-0 display-6 fw-bold">
                {/* ✅ FIX: texto pegado al </i> */}
                <i className="bi bi-chat-dots-fill me-3"></i>Gestión de PQRS
              </h1>
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-success btn-lg me-2" onClick={openCreateModal}>
                {/* ✅ FIX: texto pegado al </i> */}
                <i className="bi bi-plus-circle me-2"></i>Nueva
              </button>
              <button className="btn btn-danger btn-lg" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show shadow" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Estadísticas */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon"><i className="bi bi-collection-fill"></i></div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.total}</h3>
                <p className="stat-label">Total PQRS</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="stat-card stat-card-warning">
              <div className="stat-icon"><i className="bi bi-clock-history"></i></div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.pendientes}</h3>
                <p className="stat-label">Pendientes</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="stat-card stat-card-info">
              <div className="stat-icon"><i className="bi bi-arrow-repeat"></i></div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.proceso}</h3>
                <p className="stat-label">En Proceso</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="stat-card stat-card-success">
              <div className="stat-icon"><i className="bi bi-check-circle-fill"></i></div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.resueltos}</h3>
                <p className="stat-label">Resueltos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select className="form-select form-select-lg border-0 bg-light" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                  <option value="">📋 Todos los tipos</option>
                  <option value="Queja">🔴 Queja</option>
                  <option value="Reclamo">⚠️ Reclamo</option>
                  <option value="Sugerencia">💡 Sugerencia</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select form-select-lg border-0 bg-light" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                  <option value="">📊 Todos los estados</option>
                  <option value="Pendiente">⏳ Pendiente</option>
                  <option value="En Proceso">🔄 En Proceso</option>
                  <option value="Resuelto">✅ Resuelto</option>
                  <option value="Cerrado">🔒 Cerrado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-table me-2"></i>Lista de PQRS ({filteredPqrs.length})
            </h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando PQRS...</p>
              </div>
            ) : filteredPqrs.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h4 className="mt-3">No hay PQRS disponibles</h4>
                <p className="text-muted">Crea una nueva o ajusta los filtros</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="px-4">Fecha</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Mensaje</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPqrs.map((pqrs) => (
                      <tr key={pqrs.id_pqrs} className="pqrs-row">
                        <td className="px-4 text-muted">
                          {new Date(pqrs.fecha_solicitud).toLocaleDateString('es-CO')}
                        </td>
                        <td className="fw-bold">{pqrs.nombre}</td>
                        <td className="text-muted">{pqrs.correo}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {getTipoIcon(pqrs.tipo)} {pqrs.tipo}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getEstadoBadge(pqrs.estado)}`}>{pqrs.estado}</span>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <small className="text-muted">{pqrs.descripcion?.substring(0, 50)}...</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-info" onClick={() => openViewModal(pqrs)} title="Ver detalles">
                              <i className="bi bi-eye-fill"></i>
                            </button>
                            <button className="btn btn-warning" onClick={() => openEditModal(pqrs)} title="Editar">
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(pqrs.id_pqrs)} title="Eliminar">
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gradient-primary text-white">
                <h5 className="modal-title fw-bold">
                  {/* ✅ FIX: texto pegado al </i> */}
                  <i className={`bi bi-${modalMode === 'create' ? 'plus-circle' : 'pencil-square'} me-2`}></i>
                  {modalMode === 'create' ? 'Nueva PQRS' : 'Editar PQRS'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      {/* ✅ FIX: htmlFor + id en input */}
                      <label htmlFor="nombre" className="form-label fw-bold">
                        <i className="bi bi-person-fill me-2 text-primary"></i>Nombre
                      </label>
                      <input
                        id="nombre"
                        type="text"
                        name="nombre"
                        className="form-control form-control-lg"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="col-md-6">
                      {/* ✅ FIX: htmlFor + id en input */}
                      <label htmlFor="correo" className="form-label fw-bold">
                        <i className="bi bi-envelope-fill me-2 text-primary"></i>Correo
                      </label>
                      <input
                        id="correo"
                        type="email"
                        name="correo"
                        className="form-control form-control-lg"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div className="col-md-6">
                      {/* ✅ FIX: htmlFor + id en select */}
                      <label htmlFor="tipo" className="form-label fw-bold">
                        <i className="bi bi-tags-fill me-2 text-primary"></i>Tipo
                      </label>
                      <select
                        id="tipo"
                        name="tipo"
                        className="form-select form-select-lg"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Queja">🔴 Queja</option>
                        <option value="Reclamo">⚠️ Reclamo</option>
                        <option value="Sugerencia">💡 Sugerencia</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      {/* ✅ FIX: htmlFor + id en select */}
                      <label htmlFor="estado" className="form-label fw-bold">
                        <i className="bi bi-speedometer2 me-2 text-primary"></i>Estado
                      </label>
                      <select
                        id="estado"
                        name="estado"
                        className="form-select form-select-lg"
                        value={formData.estado}
                        onChange={handleChange}
                        required
                      >
                        <option value="Pendiente">⏳ Pendiente</option>
                        <option value="En Proceso">🔄 En Proceso</option>
                        <option value="Resuelto">✅ Resuelto</option>
                        <option value="Cerrado">🔒 Cerrado</option>
                      </select>
                    </div>
                    <div className="col-12">
                      {/* ✅ FIX: htmlFor + id en textarea */}
                      <label htmlFor="mensaje" className="form-label fw-bold">
                        <i className="bi bi-chat-text-fill me-2 text-primary"></i>Mensaje
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        className="form-control form-control-lg"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows="4"
                        required
                        placeholder="Descripción del PQRS..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      {/* ✅ FIX: htmlFor + id en textarea */}
                      <label htmlFor="respuesta" className="form-label fw-bold">
                        <i className="bi bi-reply-fill me-2 text-success"></i>Respuesta (Opcional)
                      </label>
                      <textarea
                        id="respuesta"
                        name="respuesta"
                        className="form-control form-control-lg"
                        value={formData.respuesta}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Respuesta del administrador..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-lg" onClick={closeModal}>
                    {/* ✅ FIX: texto pegado al </i> */}
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        {/* ✅ FIX: texto pegado al </span> */}
                        <span className="spinner-border spinner-border-sm me-2"></span>Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {modalMode === 'create' ? 'Crear' : 'Guardar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Detalles */}
      {showViewModal && selectedPqrs && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-gradient-info text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-file-text-fill me-2"></i>Detalles de PQRS #{selectedPqrs.id_pqrs}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="detail-box">
                      {/* ✅ FIX: labels del modal de vista — son display, no form controls, se usa <p> */}
                      <p className="detail-label"><i className="bi bi-person-fill me-2"></i>Nombre</p>
                      <p className="detail-value">{selectedPqrs.nombre}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-box">
                      <p className="detail-label"><i className="bi bi-envelope-fill me-2"></i>Correo</p>
                      <p className="detail-value">{selectedPqrs.correo}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="detail-box">
                      <p className="detail-label"><i className="bi bi-calendar-fill me-2"></i>Fecha</p>
                      <p className="detail-value">
                        {new Date(selectedPqrs.fecha_solicitud).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="detail-box">
                      <p className="detail-label"><i className="bi bi-tags-fill me-2"></i>Tipo</p>
                      <p className="detail-value">
                        <span className="badge bg-light text-dark border fs-6">
                          {getTipoIcon(selectedPqrs.tipo)} {selectedPqrs.tipo}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="detail-box">
                      <p className="detail-label"><i className="bi bi-speedometer2 me-2"></i>Estado</p>
                      <p className="detail-value">
                        <span className={`badge ${getEstadoBadge(selectedPqrs.estado)} fs-6`}>
                          {selectedPqrs.estado}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="detail-box">
                      <p className="detail-label"><i className="bi bi-chat-text-fill me-2"></i>Mensaje</p>
                      <div className="alert alert-light border">{selectedPqrs.descripcion}</div>
                    </div>
                  </div>
                  {selectedPqrs.respuesta && (
                    <div className="col-12">
                      <div className="detail-box">
                        <p className="detail-label text-success">
                          <i className="bi bi-reply-fill me-2"></i>Respuesta del administrador
                        </p>
                        <div className="alert alert-success border-success">{selectedPqrs.respuesta}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button className="btn btn-secondary btn-lg" onClick={closeModal}>
                  <i className="bi bi-x-circle me-2"></i>Cerrar
                </button>
                <button className="btn btn-primary btn-lg" onClick={() => { closeModal(); openEditModal(selectedPqrs); }}>
                  <i className="bi bi-pencil-fill me-2"></i>Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PqrsAdmin;