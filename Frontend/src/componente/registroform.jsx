export default function registroform() {
  return (
    <form className="mb-4">
      <div className="mb-3">
        <label htmlFor="usuario" className="form-label">Usuario</label>
        <input id="usuario" type="text" className="form-control" />
      </div>
      <div className="mb-3">
        <label htmlFor="contrasena" className="form-label">Contraseña</label>
        <input id="contrasena" type="password" className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary">Registrar</button>
    </form>
  );
}