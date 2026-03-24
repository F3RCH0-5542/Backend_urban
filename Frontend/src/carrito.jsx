import { useEffect, useState } from "react";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 🆕 Estado para los datos de envío y pago
  const [datosEnvio, setDatosEnvio] = useState({
    direccion: "",
    ciudad: "",
    telefono: "",
    metodo_pago: "efectivo"
  });

  useEffect(() => {
    console.log("=== DEBUGGING CARRITO ===");
    const carritoRaw = localStorage.getItem("carritoUrbanCops");
    console.log("1. localStorage raw:", carritoRaw);

    if (carritoRaw) {
      try {
        const carritoParseado = JSON.parse(carritoRaw);
        console.log("2. Carrito parseado:", carritoParseado);
        setCarrito(carritoParseado);
      } catch (error) {
        console.error("ERROR al parsear:", error);
        setCarrito([]);
      }
    } else {
      setCarrito([]);
    }
  }, []);

  useEffect(() => {
    const nuevoTotal = carrito.reduce(
      (acc, item) => acc + item.precio * (item.cantidad || 1),
      0
    );
    setTotal(nuevoTotal);

    if (carrito.length > 0) {
      localStorage.setItem("carritoUrbanCops", JSON.stringify(carrito));
    }
  }, [carrito]);

  const cambiarCantidad = (index, cambio) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = Math.max(
      1,
      (nuevoCarrito[index].cantidad || 1) + cambio
    );
    setCarrito(nuevoCarrito);
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);

    if (nuevoCarrito.length === 0) {
      localStorage.removeItem("carritoUrbanCops");
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carritoUrbanCops");
    setMostrarFormulario(false);
  };

  const finalizarCompra = async () => {
    // ✅ Validar formulario
    if (!datosEnvio.direccion.trim()) {
      alert("⚠️ Por favor ingresa tu dirección completa");
      return;
    }
    if (!datosEnvio.ciudad.trim()) {
      alert("⚠️ Por favor ingresa tu ciudad");
      return;
    }
    if (!datosEnvio.telefono.trim()) {
      alert("⚠️ Por favor ingresa tu teléfono");
      return;
    }

    // ✅ Verificar token
    const token = localStorage.getItem("token");
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");

    console.log("🔐 Verificando autenticación...");
    console.log("Token:", token);
    console.log("Usuario:", usuarioLogueado);

    if (!token || !usuarioLogueado) {
      alert("⚠️ Debes iniciar sesión para finalizar la compra");
      window.location.href = "/login";
      return;
    }

    setProcesando(true);

    try {
      const productos = carrito.map(item => ({
        id_producto: item.id_producto || item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad || 1,
        imagen: item.imagen
      }));

      const datosCompra = {
        productos,
        total,
        direccion: datosEnvio.direccion,
        ciudad: datosEnvio.ciudad,
        telefono: datosEnvio.telefono,
        metodo_pago: datosEnvio.metodo_pago
      };

      console.log("📤 Enviando datos:", datosCompra);

      const respuesta = await fetch("http://localhost:3001/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosCompra)
      });

      const data = await respuesta.json();
      console.log("📥 Respuesta:", data);

      if (respuesta.ok && data.ok) {
        alert(
          `✅ ¡Gracias por tu compra!\n\n` +
          `📦 Pedido #${data.pedido.id_pedido}\n` +
          `💰 Total: $${total.toLocaleString()} COP\n` +
          `📍 Envío a: ${datosEnvio.direccion}, ${datosEnvio.ciudad}\n` +
          `💳 Pago: ${datosEnvio.metodo_pago}`
        );
        vaciarCarrito();
        window.location.href = "/";
      } else {
        alert(`❌ ${data.msg || 'Error al procesar el pedido'}`);
      }

    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Error al conectar con el servidor: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-dark">
        <div className="container">
          <a className="navbar-brand text-white" href="/">
            <img src="/img/logo12.png" alt="UrbanCops" width="40" className="me-2" />UrbanCops
          </a>
          <a href="/" className="btn btn-outline-light">← Volver a la tienda</a>
        </div>
      </nav>

      <section className="container my-5">
        <h2 className="text-center mb-4">🛒 Tu Carrito de Compras</h2>

        {carrito.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-cart-x" style={{ fontSize: '5rem', color: '#ccc' }}></i>
            <p className="fs-4 mt-3">Tu carrito está vacío</p>
            <a href="/" className="btn btn-primary mt-3">Ir a comprar</a>
          </div>
        ) : (
          <>
            <div className="row gy-4">
              {carrito.map((item, index) => {
                const subtotal = item.precio * (item.cantidad || 1);
                return (
                  <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow">
                      <div className="bg-light p-3">
                        <img
                          src={item.imagen || "/img/default_gorra.png"}
                          className="card-img-top"
                          alt={item.nombre}
                          style={{ height: "200px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{item.nombre}</h5>
                        <p className="card-text fw-bold">
                          ${item.precio.toLocaleString()} COP
                        </p>

                        <div className="d-flex justify-content-center align-items-center my-3">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => cambiarCantidad(index, -1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="mx-3 fw-bold fs-5">{item.cantidad || 1}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => cambiarCantidad(index, 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        <p className="card-text text-success fw-bold">
                          Subtotal: ${subtotal.toLocaleString()} COP
                        </p>

                        <button
                          className="btn btn-danger w-100 mt-auto"
                          onClick={() => eliminarProducto(index)}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FORMULARIO DE ENVÍO Y PAGO */}
            <div className="card mt-5 shadow-lg">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                  <i className="bi bi-truck"></i> Información de Envío y Pago
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* FORMULARIO */}
                  <div className="col-md-6">
                    <h5 className="mb-3">📍 Dirección de Envío</h5>

                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label fw-bold">
                        Dirección Completa *
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Ingresa tu dirección completa incluyendo barrio y ciudad"
                        value={datosEnvio.direccion}
                        onChange={(e) => setDatosEnvio({
                          ...datosEnvio,
                          direccion: e.target.value
                        })}
                        required
                      />
                      <small className="text-muted">
                        Ejemplo: Calle 123 #45-67, Barrio Centro, Bogotá
                      </small>
                    </div>


                    <div className="mb-3">
                      <label htmlFor="ciudad" className="form-label fw-bold">Ciudad *</label>
                      <input
                        id="ciudad"
                        type="text"
                        className="form-control"
                        placeholder="Ej: Bogotá"
                        value={datosEnvio.ciudad}
                        onChange={(e) => setDatosEnvio({
                          ...datosEnvio,
                          ciudad: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label fw-bold">Teléfono *</label>
                      <input
                        id="telefono"
                        type="tel"
                        className="form-control"
                        placeholder="Ej: 3001234567"
                        value={datosEnvio.telefono}
                        onChange={(e) => setDatosEnvio({
                          ...datosEnvio,
                          telefono: e.target.value
                        })}
                        required
                      />
                    </div>
                    <hr />

                    <h5 className="mb-3">💳 Método de Pago</h5>
                    <select
                      className="form-select form-select-lg"
                      value={datosEnvio.metodo_pago}
                      onChange={(e) => setDatosEnvio({
                        ...datosEnvio,
                        metodo_pago: e.target.value
                      })}
                    >
                      <option value="efectivo">💵 Efectivo</option>
                      <option value="nequi">📱 Nequi</option>
                      <option value="daviplata">📱 Daviplata</option>
                      <option value="tarjeta">💳 Tarjeta</option>
                      <option value="transferencia">🏦 Transferencia</option>
                    </select>
                  </div>

                  {/* RESUMEN */}
                  <div className="col-md-6">
                    <div className="card bg-light h-100">
                      <div className="card-body">
                        <h5>📋 Resumen del pedido</h5>

                        {carrito.map((item, i) => (
                          <div key={i} className="d-flex justify-content-between mb-2">
                            <small>• {item.nombre} x{item.cantidad}</small>
                            <small className="fw-bold">
                              ${(item.precio * item.cantidad).toLocaleString()}
                            </small>
                          </div>
                        ))}

                        <hr />

                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal:</span>
                          <span className="fw-bold">${total.toLocaleString()} COP</span>
                        </div>

                        <div className="d-flex justify-content-between mb-3">
                          <span>Envío:</span>
                          <span className="text-success fw-bold">GRATIS</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">
                          <h5>Total a pagar:</h5>
                          <h5 className="text-success">${total.toLocaleString()} COP</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTONES */}
                <div className="row mt-4">
                  <div className="col-md-6 mx-auto">
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-success btn-lg"
                        onClick={finalizarCompra}
                        disabled={procesando}
                      >
              
                        {procesando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>Procesando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle"></i> Confirmar Pedido
                          </>
                        )}
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={vaciarCarrito}
                        disabled={procesando}
                      >
                        <i className="bi bi-trash"></i> Vaciar Carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Carrito;